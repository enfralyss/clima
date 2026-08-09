import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToHistory, clearHistory, loadHistory } from '../src/storage/history';
import { HistoryEntry } from '../src/types';

const entry = (city: string, savedAt = 1000): HistoryEntry => ({
  city,
  temp: 30,
  description: 'soleado',
  icon: '01d',
  savedAt,
});

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('historial', () => {
  it('empieza vacío', async () => {
    await expect(loadHistory()).resolves.toEqual([]);
  });

  it('guarda las búsquedas con la más reciente primero', async () => {
    await addToHistory(entry('Panamá', 1));
    const result = await addToHistory(entry('Bogotá', 2));
    expect(result.map((e) => e.city)).toEqual(['Bogotá', 'Panamá']);
    await expect(loadHistory()).resolves.toHaveLength(2);
  });

  it('no repite ciudades: la nueva búsqueda reemplaza a la anterior', async () => {
    await addToHistory(entry('Panamá', 1));
    await addToHistory(entry('Bogotá', 2));
    const result = await addToHistory(entry('panamá', 3));
    expect(result.map((e) => e.city)).toEqual(['panamá', 'Bogotá']);
  });

  it('conserva como máximo 20 entradas', async () => {
    for (let i = 0; i < 25; i++) {
      await addToHistory(entry(`Ciudad ${i}`, i));
    }
    const result = await loadHistory();
    expect(result).toHaveLength(20);
    expect(result[0].city).toBe('Ciudad 24');
  });

  it('borra todo el historial', async () => {
    await addToHistory(entry('Panamá'));
    await clearHistory();
    await expect(loadHistory()).resolves.toEqual([]);
  });

  it('devuelve lista vacía si lo guardado está corrupto', async () => {
    await AsyncStorage.setItem('@clima/historial', 'esto no es json');
    await expect(loadHistory()).resolves.toEqual([]);
  });
});
