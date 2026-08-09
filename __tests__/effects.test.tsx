import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WeatherEffects, { effectForIcon } from '../src/components/WeatherEffects';

describe('effectForIcon', () => {
  it('no devuelve efecto sin icono', () => {
    expect(effectForIcon()).toBeNull();
  });

  it('mapea cada tipo de clima a su efecto', () => {
    expect(effectForIcon('01d')).toBe('sun');
    expect(effectForIcon('02d')).toBe('sun');
    expect(effectForIcon('09d')).toBe('rain');
    expect(effectForIcon('10d')).toBe('rain');
    expect(effectForIcon('11d')).toBe('rain');
    expect(effectForIcon('04d')).toBe('clouds');
    expect(effectForIcon('13d')).toBe('clouds');
    expect(effectForIcon('01n')).toBe('night');
    expect(effectForIcon('10n')).toBe('night');
  });
});

describe('WeatherEffects', () => {
  it.each([
    ['01d', 'effect-sun'],
    ['10d', 'effect-rain'],
    ['04d', 'effect-clouds'],
    ['01n', 'effect-night'],
  ])('renderiza el efecto para el icono %s', async (icon, testId) => {
    await render(<WeatherEffects icon={icon} />);
    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  it('no renderiza nada sin icono', async () => {
    await render(<WeatherEffects />);
    expect(screen.queryByTestId(/effect-/)).toBeNull();
  });
});
