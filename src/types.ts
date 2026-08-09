export type Weather = {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  max: number;
  min: number;
  wind: number;
  dewPoint: number;
  icon: string;
  time: string;
  dateLabel: string;
};

export type HourForecast = {
  label: string;
  temp: number;
  icon: string;
};

export type CitySuggestion = {
  name: string;
  region: string;
  query: string;
};

export type HistoryEntry = {
  city: string;
  temp: number;
  description: string;
  icon: string;
  savedAt: number;
};

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export type SearchError = {
  query: string;
  notFound: boolean;
  suggestion: string | null;
};

export type Unit = 'C' | 'F';
