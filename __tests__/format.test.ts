import {
  capitalize,
  celsiusToFahrenheit,
  displayTemp,
  formatDate,
  formatTime,
  historyTimeLabel,
} from '../src/utils/format';

describe('conversión de temperatura', () => {
  it('convierte celsius a fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(32)).toBeCloseTo(89.6);
  });

  it('muestra la temperatura redondeada según la unidad', () => {
    expect(displayTemp(32.2, 'C')).toBe('32°');
    expect(displayTemp(32.2, 'F')).toBe('90°');
    expect(displayTemp(-0.4, 'C')).toBe('0°');
  });
});

describe('capitalize', () => {
  it('pone en mayúscula la primera letra', () => {
    expect(capitalize('soleado')).toBe('Soleado');
    expect(capitalize('lluvia ligera')).toBe('Lluvia ligera');
  });

  it('tolera cadenas vacías', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('fechas', () => {
  const fecha = new Date(2026, 7, 9, 14, 5); // domingo 9 de agosto de 2026

  it('formatea la fecha en español', () => {
    expect(formatDate(fecha)).toBe('domingo, 9 de agosto');
  });

  it('formatea la hora con minutos de dos dígitos', () => {
    expect(formatTime(fecha)).toBe('14:05');
  });

  it('usa horas UTC cuando se le pide', () => {
    const utc = new Date(Date.UTC(2026, 7, 9, 19, 32));
    expect(formatTime(utc, true)).toBe('19:32');
    expect(formatDate(utc, true)).toBe('domingo, 9 de agosto');
  });
});

describe('historyTimeLabel', () => {
  const now = new Date(2026, 7, 9, 15, 0).getTime();

  it('muestra la hora si fue hoy', () => {
    const savedAt = new Date(2026, 7, 9, 14, 32).getTime();
    expect(historyTimeLabel(savedAt, now)).toBe('14:32');
  });

  it('muestra "ayer" si fue el día anterior', () => {
    const savedAt = new Date(2026, 7, 8, 20, 0).getTime();
    expect(historyTimeLabel(savedAt, now)).toBe('ayer');
  });

  it('muestra la fecha si fue antes', () => {
    const savedAt = new Date(2026, 6, 30, 10, 0).getTime();
    expect(historyTimeLabel(savedAt, now)).toBe('30 de julio');
  });
});
