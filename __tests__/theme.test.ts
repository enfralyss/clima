import { dotColor, paletteForIcon, palettes } from '../src/theme';

describe('paletteForIcon', () => {
  it('usa la paleta de inicio si no hay icono', () => {
    expect(paletteForIcon()).toBe(palettes.home);
  });

  it('usa la paleta de noche para noches despejadas o nubladas', () => {
    expect(paletteForIcon('01n')).toBe(palettes.night);
    expect(paletteForIcon('04n')).toBe(palettes.night);
  });

  it('la lluvia manda sobre la noche: noche lluviosa usa la paleta de lluvia', () => {
    expect(paletteForIcon('10n')).toBe(palettes.rain);
    expect(paletteForIcon('11n')).toBe(palettes.rain);
  });

  it('elige la paleta según el clima de día', () => {
    expect(paletteForIcon('01d')).toBe(palettes.sunny);
    expect(paletteForIcon('02d')).toBe(palettes.sunny);
    expect(paletteForIcon('09d')).toBe(palettes.rain);
    expect(paletteForIcon('10d')).toBe(palettes.rain);
    expect(paletteForIcon('11d')).toBe(palettes.rain);
    expect(paletteForIcon('04d')).toBe(palettes.clouds);
    expect(paletteForIcon('13d')).toBe(palettes.clouds);
    expect(paletteForIcon('50d')).toBe(palettes.clouds);
  });
});

describe('dotColor', () => {
  it('devuelve dorado por defecto y para cielo despejado', () => {
    expect(dotColor()).toBe('#ffd07a');
    expect(dotColor('01d')).toBe('#ffd07a');
    expect(dotColor('02d')).toBe('#ffd07a');
  });

  it('devuelve violeta de noche despejada y azul si llueve de noche', () => {
    expect(dotColor('01n')).toBe('#b8a8f0');
    expect(dotColor('10n')).toBe('#8ab4e8');
  });

  it('devuelve azul para lluvia y tormenta', () => {
    expect(dotColor('09d')).toBe('#8ab4e8');
    expect(dotColor('10d')).toBe('#8ab4e8');
    expect(dotColor('11d')).toBe('#8ab4e8');
  });

  it('devuelve tonos claros para nieve y nubes', () => {
    expect(dotColor('13d')).toBe('#dbe7f5');
    expect(dotColor('04d')).toBe('#b9c4d6');
    expect(dotColor('50d')).toBe('#b9c4d6');
  });
});
