import React from 'react';
import { configure, fireEvent, render, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

// generous margin for slow machines: the first run transpiles everything
configure({ asyncUtilTimeout: 15000 });

const panamaWeather = {
  name: 'Panamá',
  timezone: -18000,
  main: { temp: 32.2, feels_like: 36.1, humidity: 74, temp_min: 26.4, temp_max: 33.1 },
  weather: [{ description: 'soleado', icon: '01d' }],
  wind: { speed: 3.4 },
};

const panamaForecast = {
  city: { timezone: -18000 },
  list: [
    { dt: 3600 * 20, main: { temp: 31.4 }, weather: [{ icon: '01d' }] },
    { dt: 3600 * 23, main: { temp: 30.2 }, weather: [{ icon: '01d' }] },
    { dt: 3600 * 26, main: { temp: 29.1 }, weather: [{ icon: '01n' }] },
  ],
};

const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: async () => body });
const notFound = () => Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
const serverError = () => Promise.resolve({ ok: false, status: 500, json: async () => ({}) });

function mockApi({ weatherFails }: { weatherFails?: 'notFound' | 'server' } = {}) {
  const mock = jest.fn((url: string) => {
    if (url.includes('/geo/1.0/direct')) {
      if (url.includes('Panamaa')) return ok([]);
      return ok([{ name: 'Panama City', local_names: { es: 'Panamá' }, country: 'PA' }]);
    }
    if (url.includes('/data/2.5/weather')) {
      if (weatherFails === 'notFound') return notFound();
      if (weatherFails === 'server') return serverError();
      return ok(panamaWeather);
    }
    if (url.includes('/data/2.5/forecast')) return ok(panamaForecast);
    return Promise.reject(new Error(`URL inesperada: ${url}`));
  });
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}

async function buscar(ciudad: string) {
  const input = await screen.findByPlaceholderText('Buscar ciudad');
  await fireEvent.changeText(input, ciudad);
  await fireEvent.press(screen.getByLabelText('Buscar'));
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('búsqueda exitosa', () => {
  it('muestra temperatura, humedad y descripción del clima', async () => {
    mockApi();
    await render(<App />);
    await buscar('Panamá');

    expect(await screen.findByText('32°')).toBeTruthy();
    expect(screen.getByText('74%')).toBeTruthy();
    expect(screen.getByText('Soleado')).toBeTruthy();
    expect(screen.getByText('Máx. 33° · Mín. 26°')).toBeTruthy();
    expect(screen.getByText('Viento 12 km/h')).toBeTruthy();
  });

  it('cambia entre °C y °F al tocar la temperatura', async () => {
    mockApi();
    await render(<App />);
    await buscar('Panamá');

    await fireEvent.press(await screen.findByLabelText('Cambiar unidad'));
    expect(await screen.findByText('90°')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Cambiar unidad'));
    expect(await screen.findByText('32°')).toBeTruthy();
  });
});

describe('input y botón de búsqueda', () => {
  it('dispara la petición a la API con la ciudad escrita', async () => {
    const mock = mockApi();
    await render(<App />);
    await buscar('Panamá');
    await screen.findByText('32°');

    const weatherCall = mock.mock.calls.find(([url]) => url.includes('/data/2.5/weather'));
    expect(weatherCall).toBeDefined();
    expect(weatherCall![0]).toContain('q=Panam%C3%A1');
    expect(weatherCall![0]).toContain('units=metric');
    expect(weatherCall![0]).toContain('lang=es');
  });

  it('no busca nada si el campo está vacío', async () => {
    const mock = mockApi();
    await render(<App />);
    await fireEvent.press(await screen.findByLabelText('Buscar'));

    expect(mock).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Buscar ciudad')).toBeTruthy();
  });
});

describe('ciudad inválida', () => {
  it('muestra el estado de error con el término buscado', async () => {
    mockApi({ weatherFails: 'notFound' });
    await render(<App />);
    await buscar('Panamaa');

    expect(await screen.findByText('Ciudad no encontrada')).toBeTruthy();
    expect(screen.getByText(/«Panamaa»/)).toBeTruthy();
  });

  it('sugiere la ciudad correcta y busca al tocarla', async () => {
    const mock = mockApi({ weatherFails: 'notFound' });
    await render(<App />);
    await buscar('Panamaa');

    const sugerencia = await screen.findByText('¿Quisiste decir Panamá?');
    mock.mockImplementation((url: string) => {
      if (url.includes('/data/2.5/weather')) return ok(panamaWeather);
      if (url.includes('/data/2.5/forecast')) return ok(panamaForecast);
      return ok([]);
    });
    await fireEvent.press(sugerencia);

    expect(await screen.findByText('32°')).toBeTruthy();
  });

  it('reintenta la última búsqueda con el botón Reintentar', async () => {
    const mock = mockApi({ weatherFails: 'server' });
    await render(<App />);
    await buscar('Panamá');

    expect(await screen.findByText('Algo salió mal')).toBeTruthy();

    mock.mockImplementation((url: string) => {
      if (url.includes('/data/2.5/weather')) return ok(panamaWeather);
      if (url.includes('/data/2.5/forecast')) return ok(panamaForecast);
      return ok([]);
    });
    await fireEvent.press(screen.getByText('Reintentar'));

    expect(await screen.findByText('32°')).toBeTruthy();
  });
});

describe('historial', () => {
  it('guarda la búsqueda, la muestra en el historial y permite borrarla', async () => {
    mockApi();
    await render(<App />);
    await buscar('Panamá');
    await screen.findByText('32°');

    await fireEvent.press(screen.getByLabelText('Volver'));
    await fireEvent.press(await screen.findByText('Historial'));

    expect(await screen.findByText('Panamá')).toBeTruthy();
    expect(screen.getByText(/Soleado ·/)).toBeTruthy();

    await fireEvent.press(screen.getByText('Borrar'));
    expect(await screen.findByText('Todavía no hay búsquedas guardadas.')).toBeTruthy();

    await fireEvent.press(screen.getByText('Nueva búsqueda'));
    expect(await screen.findByPlaceholderText('Buscar ciudad')).toBeTruthy();
  });

  it('vuelve a buscar una ciudad al tocarla en el historial', async () => {
    mockApi();
    await render(<App />);
    await buscar('Panamá');
    await screen.findByText('32°');

    await fireEvent.press(screen.getByLabelText('Volver'));
    await fireEvent.press(await screen.findByText('Historial'));
    await fireEvent.press(await screen.findByText('Panamá'));

    expect(await screen.findByText('Soleado')).toBeTruthy();
    expect(screen.getByText('74%')).toBeTruthy();
  });
});
