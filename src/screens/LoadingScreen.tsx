import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import AuroraBackground from '../components/AuroraBackground';
import SearchIcon from '../components/SearchIcon';
import { colors, fonts, glass, glassSoft, palettes } from '../theme';

type Props = {
  query: string;
};

export default function LoadingScreen({ query }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const skeletonOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <AuroraBackground palette={palettes.loading}>
      <View style={styles.container}>
        <View style={styles.searchPill}>
          <SearchIcon />
          <Text style={styles.query}>{query}</Text>
        </View>

        <View style={styles.center}>
          <Animated.View style={[styles.spinner, { transform: [{ rotate: rotation }] }]} />
          <Text style={styles.message}>Buscando el clima en {query}…</Text>
        </View>

        <Animated.View style={[styles.skeletons, { opacity: skeletonOpacity }]}>
          <View style={styles.skeletonBlock} />
          <View style={styles.skeletonBar} />
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  query: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.text,
    marginLeft: 12,
  },
  center: {
    alignItems: 'center',
    marginVertical: 36,
  },
  spinner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.15)',
    borderTopColor: colors.lightBlue,
    marginBottom: 20,
  },
  message: {
    fontFamily: fonts.bodyLight,
    fontSize: 16,
    color: colors.textDim,
  },
  skeletons: {
    alignItems: 'center',
    gap: 14,
  },
  skeletonBlock: {
    ...glassSoft,
    width: 180,
    height: 120,
    borderRadius: 28,
  },
  skeletonBar: {
    ...glassSoft,
    width: 120,
    height: 20,
    borderRadius: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
    marginTop: 10,
  },
  skeletonCard: {
    ...glassSoft,
    flex: 1,
    height: 100,
    borderRadius: 22,
  },
});
