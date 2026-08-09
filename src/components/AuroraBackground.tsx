import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Glow, Palette } from '../theme';
import WeatherEffects from './WeatherEffects';

type Props = {
  palette: Palette;
  icon?: string;
  children: React.ReactNode;
};

// each color glow drifts slowly in a different direction so the
// background feels alive without being distracting
function GlowLayer({ glow, index }: { glow: Glow; index: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: 9000 + index * 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 9000 + index * 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, index]);

  const direction = index % 2 === 0 ? 1 : -1;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }),
          transform: [
            { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, 24 * direction] }) },
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, 14 * direction] }) },
          ],
        },
      ]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`glow-${index}`} cx={glow.cx} cy={glow.cy} rx={glow.rx} ry={glow.ry}>
            <Stop offset="0" stopColor={glow.color} stopOpacity={glow.opacity} />
            <Stop offset="1" stopColor={glow.color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#glow-${index})`} />
      </Svg>
    </Animated.View>
  );
}

export default function AuroraBackground({ palette, icon, children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={palette.base}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {palette.glows.map((glow, i) => (
        <GlowLayer key={i} glow={glow} index={i} />
      ))}
      <WeatherEffects icon={icon} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 64,
  },
});
