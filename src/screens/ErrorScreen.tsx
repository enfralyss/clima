import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuroraBackground from '../components/AuroraBackground';
import FadeIn from '../components/FadeIn';
import SearchIcon from '../components/SearchIcon';
import { colors, fonts, glass, palettes } from '../theme';
import { SearchError } from '../types';

type Props = {
  error: SearchError;
  onRetry: () => void;
  onEdit: () => void;
  onSuggestion: (city: string) => void;
};

export default function ErrorScreen({ error, onRetry, onEdit, onSuggestion }: Props) {
  const notFound = error.notFound;

  return (
    <AuroraBackground palette={palettes.error}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.searchPill} onPress={onEdit} accessibilityRole="button">
          <SearchIcon />
          <Text style={styles.query}>{error.query}</Text>
        </TouchableOpacity>

        <FadeIn style={styles.center}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>!</Text>
          </View>

          <Text style={styles.title}>{notFound ? 'Ciudad no encontrada' : 'Algo salió mal'}</Text>
          <Text style={styles.message}>
            {notFound
              ? `No encontramos «${error.query}». Revisa el nombre e inténtalo de nuevo.`
              : 'No pudimos obtener el clima. Revisa tu conexión e inténtalo de nuevo.'}
          </Text>

          <TouchableOpacity style={styles.retryButton} onPress={onRetry} accessibilityRole="button">
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>

          {error.suggestion && (
            <TouchableOpacity onPress={() => onSuggestion(error.suggestion!)} hitSlop={10}>
              <Text style={styles.suggestion}>¿Quisiste decir {error.suggestion}?</Text>
            </TouchableOpacity>
          )}
        </FadeIn>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  searchPill: {
    ...glass,
    borderColor: 'rgba(230,120,150,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  query: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.text,
    marginLeft: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,120,150,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,150,170,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  badgeText: {
    fontFamily: fonts.displayLight,
    fontSize: 40,
    color: colors.errorPink,
  },
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 26,
    color: colors.text,
    marginBottom: 16,
  },
  message: {
    fontFamily: fonts.bodyLight,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 36,
  },
  retryButton: {
    ...glass,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  retryText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.text,
  },
  suggestion: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.errorLilac,
  },
});
