import { useCallback, useEffect, useRef, useState } from 'react';
import { CityNotFoundError, getForecast, getWeather, suggestCity } from '../api/weather';
import { addToHistory, clearHistory, loadHistory } from '../storage/history';
import { HistoryEntry, HourForecast, SearchError, SearchStatus, Weather } from '../types';

export function useWeather() {
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<HourForecast[]>([]);
  const [error, setError] = useState<SearchError | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  const search = useCallback(async (city: string) => {
    const id = ++requestId.current;
    setStatus('loading');
    setError(null);

    try {
      const result = await getWeather(city);
      const hours = await getForecast(city).catch(() => []);
      if (id !== requestId.current) return;

      setWeather(result);
      setForecast(hours);
      setStatus('success');

      const entry: HistoryEntry = {
        city: result.city,
        temp: result.temp,
        description: result.description,
        icon: result.icon,
        savedAt: Date.now(),
      };
      const next = await addToHistory(entry);
      if (id === requestId.current) setHistory(next);
    } catch (err) {
      if (id !== requestId.current) return;

      if (err instanceof CityNotFoundError) {
        const suggestion = await suggestCity(city).catch(() => null);
        if (id !== requestId.current) return;
        setError({ query: city, notFound: true, suggestion });
      } else {
        setError({ query: city, notFound: false, suggestion: null });
      }
      setStatus('error');
    }
  }, []);

  const retry = useCallback(() => {
    if (error) search(error.query);
  }, [error, search]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  const clear = useCallback(async () => {
    await clearHistory();
    setHistory([]);
  }, []);

  return { status, weather, forecast, error, history, search, retry, reset, clearHistory: clear };
}
