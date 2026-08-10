import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export type WeatherEffect = 'sun' | 'rain' | 'clouds' | 'night';

// la condición manda sobre el día/noche: llueve igual de noche que de día,
// las estrellas solo salen con cielo despejado
export function effectForIcon(icon?: string): WeatherEffect | null {
  if (!icon) return null;
  const code = icon.slice(0, 2);
  if (code === '09' || code === '10' || code === '11') return 'rain';
  if (code === '03' || code === '04' || code === '13' || code === '50') return 'clouds';
  if (icon.endsWith('n')) return 'night';
  return 'sun';
}

// looping value from 0 to 1, with an initial delay to offset each element
function useLoop(duration: number, delay = 0) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]);
    animation.start();
    return () => animation.stop();
  }, [value, duration, delay]);

  return value;
}

function RainDrop({ x, delay, duration, screenHeight }: { x: number; delay: number; duration: number; screenHeight: number }) {
  const t = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        styles.drop,
        {
          left: x,
          opacity: t.interpolate({ inputRange: [0, 0.08, 0.85, 1], outputRange: [0, 0.55, 0.55, 0] }),
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-50, screenHeight + 50] }) },
          ],
        },
      ]}
    />
  );
}

function Star({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  const t = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.12, 0.9, 0.12] }),
        },
      ]}
    />
  );
}

function Cloud({ y, width, delay, duration }: { y: number; width: number; delay: number; duration: number }) {
  const t = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top: y,
          width,
          opacity: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.85, 0.5] }),
          transform: [
            { translateX: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-28, 28, -28] }) },
          ],
        },
      ]}
    />
  );
}

function SunGlow({ screenWidth }: { screenWidth: number }) {
  const t = useLoop(6000);
  return (
    <Animated.View
      style={[
        styles.sun,
        {
          left: screenWidth - 200,
          opacity: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.85, 0.5] }),
          transform: [
            { scale: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] }) },
          ],
        },
      ]}
    >
      <Svg width={280} height={280}>
        <Defs>
          <RadialGradient id="sun-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#ffd68c" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#ffd68c" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="140" cy="140" r="140" fill="url(#sun-glow)" />
      </Svg>
    </Animated.View>
  );
}

export default function WeatherEffects({ icon }: { icon?: string }) {
  const effect = effectForIcon(icon);
  const { width, height } = useWindowDimensions();

  // aguaceros y tormentas caen con más gotas y más rápido que la lluvia normal
  const heavyRain = !!icon && (icon.startsWith('09') || icon.startsWith('11'));
  const dropCount = heavyRain ? 22 : 14;
  const dropBaseMs = heavyRain ? 650 : 950;

  const drops = useMemo(
    () =>
      Array.from({ length: dropCount }, (_, i) => ({
        x: Math.round((width / dropCount) * i + Math.random() * 18),
        delay: Math.round(Math.random() * 1400),
        duration: dropBaseMs + Math.round(Math.random() * 550),
      })),
    [width, dropCount, dropBaseMs]
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: Math.round(Math.random() * (width - 16) + 8),
        y: Math.round(Math.random() * height * 0.55 + 10),
        size: 2 + Math.round(Math.random() * 3),
        delay: Math.round(Math.random() * 2200),
        duration: 1800 + Math.round(Math.random() * 1800),
      })),
    [width, height]
  );

  const clouds = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        y: 70 + i * 110 + Math.round(Math.random() * 30),
        width: 180 + Math.round(Math.random() * 120),
        delay: i * 900,
        duration: 14000 + i * 3500,
      })),
    []
  );

  if (!effect) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} testID={`effect-${effect}`}>
      {effect === 'sun' && <SunGlow screenWidth={width} />}
      {effect === 'rain' &&
        drops.map((d, i) => <RainDrop key={i} {...d} screenHeight={height} />)}
      {effect === 'night' && stars.map((s, i) => <Star key={i} {...s} />)}
      {effect === 'clouds' && clouds.map((c, i) => <Cloud key={i} {...c} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  drop: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 18,
    borderRadius: 1,
    backgroundColor: 'rgba(190,215,245,0.6)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    shadowColor: '#9fd8ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  cloud: {
    position: 'absolute',
    left: -30,
    height: 74,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.055)',
  },
  sun: {
    position: 'absolute',
    top: -90,
  },
});
