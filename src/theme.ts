export const fonts = {
  displayLight: 'SpaceGrotesk_300Light',
  display: 'SpaceGrotesk_500Medium',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  bodyLight: 'DMSans_300Light',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
};

export type Glow = {
  color: string;
  opacity: number;
  cx: string;
  cy: string;
  rx: string;
  ry: string;
};

export type Palette = {
  base: [string, string, string];
  glows: Glow[];
};

export const palettes: Record<string, Palette> = {
  home: {
    base: ['#1a1f3d', '#23305e', '#2c4a72'],
    glows: [
      { color: '#7a5af8', opacity: 0.55, cx: '80%', cy: '-10%', rx: '95%', ry: '48%' },
      { color: '#2da8a8', opacity: 0.5, cx: '0%', cy: '30%', rx: '80%', ry: '40%' },
    ],
  },
  sunny: {
    base: ['#2b6a8f', '#1f5d7e', '#17485f'],
    glows: [
      { color: '#ffc46e', opacity: 0.75, cx: '75%', cy: '-5%', rx: '72%', ry: '36%' },
      { color: '#30b2aa', opacity: 0.55, cx: '-10%', cy: '55%', rx: '88%', ry: '44%' },
    ],
  },
  rain: {
    base: ['#1d3350', '#1b3f63', '#173a57'],
    glows: [
      { color: '#78a0dc', opacity: 0.5, cx: '75%', cy: '-5%', rx: '85%', ry: '42%' },
      { color: '#4670b4', opacity: 0.45, cx: '-5%', cy: '50%', rx: '80%', ry: '40%' },
    ],
  },
  clouds: {
    base: ['#2c3a52', '#33455e', '#2b3c50'],
    glows: [
      { color: '#a0b4d2', opacity: 0.35, cx: '78%', cy: '-8%', rx: '85%', ry: '42%' },
      { color: '#6482aa', opacity: 0.4, cx: '-5%', cy: '48%', rx: '80%', ry: '40%' },
    ],
  },
  night: {
    base: ['#0e1428', '#142038', '#1a2c4c'],
    glows: [
      { color: '#3cdcb4', opacity: 0.3, cx: '75%', cy: '-8%', rx: '85%', ry: '42%' },
      { color: '#5a6ee6', opacity: 0.35, cx: '0%', cy: '45%', rx: '80%', ry: '40%' },
    ],
  },
  loading: {
    base: ['#232848', '#2b3a5e', '#33456f'],
    glows: [
      { color: '#9682ff', opacity: 0.45, cx: '75%', cy: '-8%', rx: '90%', ry: '45%' },
      { color: '#5096c8', opacity: 0.4, cx: '0%', cy: '45%', rx: '80%', ry: '40%' },
    ],
  },
  error: {
    base: ['#2a2038', '#342a4c', '#3e3260'],
    glows: [
      { color: '#e65a8c', opacity: 0.4, cx: '75%', cy: '-8%', rx: '85%', ry: '42%' },
      { color: '#7850c8', opacity: 0.35, cx: '0%', cy: '48%', rx: '80%', ry: '40%' },
    ],
  },
};

// la condición manda sobre el día/noche: una noche lluviosa muestra lluvia,
// las estrellas quedan solo para noches despejadas
export function paletteForIcon(icon?: string): Palette {
  if (!icon) return palettes.home;
  const code = icon.slice(0, 2);
  if (code === '09' || code === '10' || code === '11') return palettes.rain;
  if (icon.endsWith('n')) return palettes.night;
  if (code === '01' || code === '02') return palettes.sunny;
  return palettes.clouds;
}

export function dotColor(icon?: string): string {
  if (!icon) return '#ffd07a';
  const code = icon.slice(0, 2);
  if (code === '09' || code === '10' || code === '11') return '#8ab4e8';
  if (code === '13') return '#dbe7f5';
  if (icon.endsWith('n')) return '#b8a8f0';
  if (code === '01' || code === '02') return '#ffd07a';
  return '#b9c4d6';
}

export const colors = {
  text: '#ffffff',
  textDim: 'rgba(255,255,255,0.6)',
  textFaint: 'rgba(255,255,255,0.45)',
  teal: '#7ee8dc',
  gold: '#ffd07a',
  errorPink: '#ffb3c2',
  errorLilac: '#e8a8f0',
  lightBlue: '#9fd8ff',
};

export const glass = {
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.22)',
};

export const glassSoft = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.16)',
};
