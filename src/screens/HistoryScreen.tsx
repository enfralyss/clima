import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuroraBackground from '../components/AuroraBackground';
import FadeIn from '../components/FadeIn';
import { colors, dotColor, fonts, glass, palettes } from '../theme';
import { HistoryEntry } from '../types';
import { capitalize, displayTemp, historyTimeLabel } from '../utils/format';

type Props = {
  history: HistoryEntry[];
  onSelect: (city: string) => void;
  onClear: () => void;
  onNewSearch: () => void;
};

export default function HistoryScreen({ history, onSelect, onClear, onNewSearch }: Props) {
  return (
    <AuroraBackground palette={palettes.night} icon="01n">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={onClear} hitSlop={10} accessibilityRole="button">
              <Text style={styles.clearLink}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {history.length === 0 && (
            <Text style={styles.empty}>Todavía no hay búsquedas guardadas.</Text>
          )}
          {history.map((entry, i) => (
            <FadeIn key={`${entry.city}-${entry.savedAt}`} delay={Math.min(i, 6) * 60} offset={10}>
              <TouchableOpacity style={styles.row} onPress={() => onSelect(entry.city)}>
                <View style={styles.rowLeft}>
                  <Text style={styles.city}>{entry.city}</Text>
                  <Text style={styles.sub}>
                    {capitalize(entry.description)} · {historyTimeLabel(entry.savedAt)}
                  </Text>
                </View>
                <View style={styles.rowRight}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: dotColor(entry.icon), shadowColor: dotColor(entry.icon) },
                    ]}
                  />
                  <Text style={styles.temp}>{displayTemp(entry.temp, 'C')}</Text>
                </View>
              </TouchableOpacity>
            </FadeIn>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.newSearch} onPress={onNewSearch} accessibilityRole="button">
          <Text style={styles.newSearchText}>Nueva búsqueda</Text>
        </TouchableOpacity>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 32,
    letterSpacing: -0.5,
    color: colors.text,
  },
  clearLink: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.teal,
    marginBottom: 6,
  },
  list: {
    paddingBottom: 16,
  },
  empty: {
    fontFamily: fonts.bodyLight,
    fontSize: 16,
    color: colors.textDim,
    marginTop: 24,
    textAlign: 'center',
  },
  row: {
    ...glass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  city: {
    fontFamily: fonts.bodyMedium,
    fontSize: 19,
    color: colors.text,
  },
  sub: {
    fontFamily: fonts.bodyLight,
    fontSize: 14,
    color: colors.textDim,
    marginTop: 4,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  temp: {
    fontFamily: fonts.displayLight,
    fontSize: 32,
    color: colors.text,
  },
  newSearch: {
    ...glass,
    borderRadius: 26,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 28,
  },
  newSearchText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.text,
  },
});
