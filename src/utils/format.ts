import { Unit } from '../types';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function displayTemp(celsius: number, unit: Unit): string {
  const value = unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(value)}°`;
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(date: Date, utc = false): string {
  const day = utc ? date.getUTCDay() : date.getDay();
  const dayOfMonth = utc ? date.getUTCDate() : date.getDate();
  const month = utc ? date.getUTCMonth() : date.getMonth();
  return `${DAYS[day]}, ${dayOfMonth} de ${MONTHS[month]}`;
}

export function formatTime(date: Date, utc = false): string {
  const h = utc ? date.getUTCHours() : date.getHours();
  const m = utc ? date.getUTCMinutes() : date.getMinutes();
  return `${h}:${String(m).padStart(2, '0')}`;
}

export function historyTimeLabel(savedAt: number, now = Date.now()): string {
  const saved = new Date(savedAt);
  const today = new Date(now);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(saved, today)) return formatTime(saved);

  const yesterday = new Date(now - 24 * 60 * 60 * 1000);
  if (sameDay(saved, yesterday)) return 'ayer';

  return `${saved.getDate()} de ${MONTHS[saved.getMonth()]}`;
}
