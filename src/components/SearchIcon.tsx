import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export default function SearchIcon({ size = 20, color = 'rgba(255,255,255,0.75)' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" fill="none" />
      <Line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
