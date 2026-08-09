import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { searchCities } from '../api/weather';
import AuroraBackground from '../components/AuroraBackground';
import FadeIn from '../components/FadeIn';
import SearchIcon from '../components/SearchIcon';
import { colors, fonts, glass, glassSoft, palettes } from '../theme';
import { CitySuggestion } from '../types';

import { formatDate } from '../utils/format';

type Props = {
  onSearch: (query: string) => void;
  onOpenHistory: () => void;
  hasHistory: boolean;
  initialQuery?: string;
};

export default function SearchScreen({ onSearch, onOpenHistory, hasHistory, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      searchCities(term)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const submit = () => {
    const term = query.trim();
    if (!term) return;
    Keyboard.dismiss();
    onSearch(term);
  };

  const pickSuggestion = (s: CitySuggestion) => {
    Keyboard.dismiss();
    setQuery(s.name);
    onSearch(s.query);
  };

  return (
    <AuroraBackground palette={palettes.home}>
      <View style={styles.container}>
        <Text style={styles.date}>{formatDate(new Date())}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Clima</Text>
          {hasHistory && (
            <TouchableOpacity onPress={onOpenHistory} hitSlop={10}>
              <Text style={styles.historyLink}>Historial</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchPill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buscar"
            onPress={submit}
            hitSlop={10}
            style={styles.searchButton}
          >
            <SearchIcon />
          </Pressable>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            placeholder="Buscar ciudad"
            placeholderTextColor={colors.textFaint}
            selectionColor={colors.teal}
            cursorColor={colors.teal}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>

        {suggestions.map((s, i) => (
          <FadeIn key={`${s.name}-${s.region}`} delay={i * 70} offset={10}>
            <TouchableOpacity style={styles.suggestion} onPress={() => pickSuggestion(s)}>
              <Text style={styles.suggestionText} numberOfLines={1}>
                <Text style={styles.suggestionCity}>{s.name}</Text>
                <Text style={styles.suggestionRegion}> · {s.region}</Text>
              </Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </FadeIn>
        ))}
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  date: {
    fontFamily: fonts.bodyLight,
    fontSize: 15,
    color: colors.textDim,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 40,
    letterSpacing: -1,
    color: colors.text,
  },
  historyLink: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.teal,
    marginBottom: 8,
  },
  searchPill: {
    ...glass,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#0a0e28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 8,
  },
  searchButton: {
    marginRight: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.text,
  },
  suggestion: {
    ...glassSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    minHeight: 44,
  },
  suggestionText: {
    flex: 1,
    marginRight: 12,
  },
  suggestionCity: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.text,
  },
  suggestionRegion: {
    fontFamily: fonts.bodyLight,
    fontSize: 17,
    color: colors.textDim,
  },
  arrow: {
    fontSize: 18,
    color: colors.textDim,
  },
});
