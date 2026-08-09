import {
  CityNotFoundError,
  getForecast,
  getWeather,
  mapWeather,
  searchCities,
  suggestCity,
} from '../src/api/weather';

const panamaResponse = {
  name: 'Panamá',
  timezone: -18000,
  main: { temp: 32.2, feels_like: 36.1, humidity: 74, temp_min: 26.4, temp_max: 33.1 },
  weather: [{ description: 'soleado', icon: '01d' }],
  wind: { speed: 3.4 },
};

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
const fail = (status: number) => ({ ok: false, status, json: async () => ({}) });

afterEach(() => {
  jest.restoreAllMocks();
});

describe('mapWeather', () => {
  it('mapea la respuesta de la API al modelo de la app', () => {
    const w = mapWeather(panamaResponse);
    expect(w.city).toBe('Panamá');
    expect(w.temp).toBe(32.2);
    expect(w.humidity).toBe(74);
    expect(w.description).toBe('soleado');
    expect(w.icon).toBe('01d');
    expect(w.wind).toBe(12); // 3.4 m/s ≈ 12 km/h
    expect(w.time).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it('calcula un punto de rocío razonable', () => {
    const w = mapWeather(panamaResponse);
    expect(w.dewPoint).toBeGreaterThan(25);
    expect(w.dewPoint).toBeLessThan(29);
  });

  it('tolera respuestas con campos opcionales ausentes', () => {
    const w = mapWeather({
      name: 'Panamá',
      main: { temp: 30, feels_like: 33, humidity: 70, temp_min: 26, temp_max: 32 },
    });
    expect(w.description).toBe('');
    expect(w.icon).toBe('01d');
    expect(w.wind).toBe(0);
  });
});

describe('getWeather', () => {
  it('pide el clima con la ciudad, unidades métricas y español', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(ok(panamaResponse)) as unknown as typeof fetch;
    const w = await getWeather('Panamá');
    expect(w.city).toBe('Panamá');
    const url = (globalThis.fetch as unknown as jest.Mock).mock.calls[0][0];
    expect(url).toContain('q=Panam%C3%A1');
    expect(url).toContain('units=metric');
    expect(url).toContain('lang=es');
    expect(url).toContain('appid=test-key');
  });

  it('lanza CityNotFoundError con un 404', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(fail(404)) as unknown as typeof fetch;
    await expect(getWeather('Panamaa')).rejects.toBeInstanceOf(CityNotFoundError);
  });

  it('lanza un error genérico con otros códigos', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(fail(500)) as unknown as typeof fetch;
    await expect(getWeather('Panamá')).rejects.toThrow('Error de red');
  });
});

describe('getForecast', () => {
  it('devuelve las próximas horas con su hora local', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      ok({
        city: { timezone: 0 },
        list: [
          { dt: 3600 * 15, main: { temp: 31.4 }, weather: [{ icon: '01d' }] },
          { dt: 3600 * 18, main: { temp: 27.6 }, weather: [{ icon: '01n' }] },
        ],
      })
    ) as unknown as typeof fetch;
    const hours = await getForecast('Panamá');
    expect(hours).toHaveLength(2);
    expect(hours[0]).toEqual({ label: '15:00', temp: 31.4, icon: '01d' });
    expect(hours[1].label).toBe('18:00');
  });

  it('devuelve lista vacía si la API falla', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(fail(500)) as unknown as typeof fetch;
    await expect(getForecast('Panamá')).resolves.toEqual([]);
  });

  it('tolera una respuesta sin lista ni zona horaria', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(ok({})) as unknown as typeof fetch;
    await expect(getForecast('Panamá')).resolves.toEqual([]);
  });
});

describe('searchCities', () => {
  it('mapea y deduplica sugerencias', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      ok([
        { name: 'Panama City', local_names: { es: 'Panamá' }, country: 'PA' },
        { name: 'Panama City', local_names: { es: 'Panamá' }, country: 'PA' },
        { name: 'Panama City', country: 'US', state: 'Florida' },
      ])
    ) as unknown as typeof fetch;
    const results = await searchCities('Pana');
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Panamá');
    expect(results[0].query).toBe('Panama City,PA');
    expect(results[1].region).toContain('Florida');
  });

  it('devuelve lista vacía si el geocoder falla', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(fail(500)) as unknown as typeof fetch;
    await expect(searchCities('Pana')).resolves.toEqual([]);
  });
});

describe('suggestCity', () => {
  it('recorta el término hasta encontrar una ciudad parecida', async () => {
    globalThis.fetch = jest.fn(async (url: string) => {
      if (url.includes('q=Panamaa')) return ok([]);
      return ok([{ name: 'Panama City', local_names: { es: 'Panamá' }, country: 'PA' }]);
    }) as unknown as typeof fetch;
    await expect(suggestCity('Panamaa')).resolves.toBe('Panamá');
  });

  it('devuelve null si no hay nada parecido', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(ok([])) as unknown as typeof fetch;
    await expect(suggestCity('xyzxyz')).resolves.toBeNull();
  });

  it('no sugiere la misma ciudad que ya se buscó', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      ok([{ name: 'Panamá', local_names: { es: 'Panamá' }, country: 'PA' }])
    ) as unknown as typeof fetch;
    await expect(suggestCity('panamá')).resolves.toBeNull();
  });
});
