import { CitySuggestion, HourForecast, Weather } from '../types';
import { formatDate, formatTime } from '../utils/format';

const BASE = 'https://api.openweathermap.org';
const API_KEY = process.env.EXPO_PUBLIC_OWM_API_KEY;

export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`Ciudad no encontrada: ${city}`);
    this.name = 'CityNotFoundError';
  }
}

// Approximate dew point (Magnus formula) from temperature and humidity
function dewPoint(temp: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const gamma = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return (b * gamma) / (a - gamma);
}

export function mapWeather(data: any): Weather {
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  // city local time: current epoch + the timezone offset returned by the API
  const local = new Date((Math.floor(Date.now() / 1000) + (data.timezone ?? 0)) * 1000);

  return {
    city: data.name,
    temp,
    feelsLike: data.main.feels_like,
    humidity,
    description: data.weather?.[0]?.description ?? '',
    max: data.main.temp_max,
    min: data.main.temp_min,
    wind: Math.round((data.wind?.speed ?? 0) * 3.6),
    dewPoint: dewPoint(temp, humidity),
    icon: data.weather?.[0]?.icon ?? '01d',
    time: formatTime(local, true),
    dateLabel: formatDate(local, true),
  };
}

export async function getWeather(city: string): Promise<Weather> {
  const url = `${BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`;
  const res = await fetch(url);
  if (res.status === 404) throw new CityNotFoundError(city);
  if (!res.ok) throw new Error(`Error de red (${res.status})`);
  return mapWeather(await res.json());
}

export async function getForecast(city: string): Promise<HourForecast[]> {
  const url = `${BASE}/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&cnt=5&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const offset = data.city?.timezone ?? 0;
  return (data.list ?? []).slice(0, 5).map((item: any) => ({
    label: formatTime(new Date((item.dt + offset) * 1000), true),
    temp: item.main.temp,
    icon: item.weather?.[0]?.icon ?? '01d',
  }));
}

function regionName(code: string): string {
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=4&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const seen = new Set<string>();
  const results: CitySuggestion[] = [];
  for (const item of data ?? []) {
    const name = item.local_names?.es ?? item.name;
    const region = item.state ? `${item.state}, ${regionName(item.country)}` : regionName(item.country);
    const key = `${name}|${region}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ name, region, query: `${item.name},${item.country}` });
  }
  return results;
}

// Powers the "¿Quisiste decir…?" hint on 404s: the term is checked against the
// geocoder and, if nothing matches, trimmed from the end (typos like "Panamaa")
export async function suggestCity(query: string): Promise<string | null> {
  let term = query.trim();
  for (let attempt = 0; attempt < 3 && term.length >= 3; attempt++) {
    const matches = await searchCities(term);
    if (matches.length > 0) {
      const name = matches[0].name;
      return name.toLowerCase() === query.trim().toLowerCase() ? null : name;
    }
    term = term.slice(0, -1);
  }
  return null;
}
