import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryEntry } from '../types';

const STORAGE_KEY = '@clima/historial';
const MAX_ENTRIES = 20;

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToHistory(entry: HistoryEntry): Promise<HistoryEntry[]> {
  const current = await loadHistory();
  const rest = current.filter((e) => e.city.toLowerCase() !== entry.city.toLowerCase());
  const next = [entry, ...rest].slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
