import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import AuroraBackground from '../components/AuroraBackground';
import FadeIn from '../components/FadeIn';
import { colors, dotColor, fonts, glass, paletteForIcon } from '../theme';
import { HourForecast, Unit, Weather } from '../types';
import { capitalize, displayTemp } from '../utils/format';

type Props = {
  weather: Weather;
  forecast: HourForecast[];
  unit: Unit;
  onToggleUnit: () => void;
  onBack: () => void;
  onNewSearch: () => void;
};

export default function ResultScreen({ weather, forecast, unit, onToggleUnit, onBack, onNewSearch }: Props) {
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(halo, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [halo]);

  return (
    <AuroraBackground palette={paletteForIcon(weather.icon)} icon={weather.icon}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navLabel}>AHORA</Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onNewSearch}
            accessibilityRole="button"
            accessibilityLabel="Nueva búsqueda"
          >
            <Text style={styles.navButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        <FadeIn style={styles.hero}>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.dateTime}>
            {weather.dateLabel} · {weather.time}
          </Text>

          <View style={styles.tempWrap}>
            <Animated.View
              style={[
                styles.halo,
                {
                  opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
                  transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
                },
              ]}
            >
              <Svg width={340} height={280}>
                <Defs>
                  <RadialGradient id="halo" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#ffd68c" stopOpacity="0.35" />
                    <Stop offset="1" stopColor="#ffd68c" stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Ellipse cx="170" cy="140" rx="170" ry="140" fill="url(#halo)" />
              </Svg>
            </Animated.View>
            <Pressable onPress={onToggleUnit} accessibilityRole="button" accessibilityLabel="Cambiar unidad">
              <Text style={styles.temp}>{displayTemp(weather.temp, unit)}</Text>
            </Pressable>
          </View>

          <Text style={styles.description}>{capitalize(weather.description)}</Text>
          <Text style={styles.maxMin}>
            Máx. {displayTemp(weather.max, unit)} · Mín. {displayTemp(weather.min, unit)}
          </Text>
        </FadeIn>

        <FadeIn delay={120} style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>HUMEDAD</Text>
            <Text style={styles.cardValue}>{weather.humidity}%</Text>
            <Text style={styles.cardSub}>Punto de rocío {displayTemp(weather.dewPoint, unit)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>SENSACIÓN</Text>
            <Text style={styles.cardValue}>{displayTemp(weather.feelsLike, unit)}</Text>
            <Text style={styles.cardSub}>Viento {weather.wind} km/h</Text>
          </View>
        </FadeIn>

        {forecast.length > 0 && (
          <FadeIn delay={220}>
            <View style={styles.hourStrip}>
              {forecast.map((hour) => (
                <View key={hour.label} style={styles.hourCol}>
                  <Text style={styles.hourLabel}>{hour.label}</Text>
                  <View
                    style={[
                      styles.hourDot,
                      { backgroundColor: dotColor(hour.icon), shadowColor: dotColor(hour.icon) },
                    ]}
                  />
                  <Text style={styles.hourTemp}>{displayTemp(hour.temp, unit)}</Text>
                </View>
              ))}
            </View>
          </FadeIn>
        )}
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    ...glass,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  navLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    letterSpacing: 1.5,
    color: colors.textDim,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  city: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text,
  },
  dateTime: {
    fontFamily: fonts.bodyLight,
    fontSize: 14,
    color: colors.textDim,
    marginTop: 4,
  },
  tempWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  halo: {
    position: 'absolute',
  },
  temp: {
    fontFamily: fonts.displayLight,
    fontSize: 148,
    letterSpacing: -8,
    color: colors.text,
    includeFontPadding: false,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.text,
  },
  maxMin: {
    fontFamily: fonts.bodyLight,
    fontSize: 15,
    color: colors.textDim,
    marginTop: 6,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    ...glass,
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.textDim,
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.text,
  },
  cardSub: {
    fontFamily: fonts.bodyLight,
    fontSize: 14,
    color: colors.textDim,
    marginTop: 8,
  },
  hourStrip: {
    ...glass,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  hourCol: {
    alignItems: 'center',
  },
  hourLabel: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 10,
  },
  hourDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  hourTemp: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.text,
  },
});
