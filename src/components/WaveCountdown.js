import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WaveCountdown({ value, total, wave }) {
  if (!total) return null;

  const progress = total > 0 ? value / total : 0; // 1.0 -> 0.0
  const scale = 1 + (1 - progress) * 0.8;
  const intensity = (1 - progress) * 8;
  const shakeX = Math.sin(Date.now() * 0.03) * intensity;
  const color = progress > 0.6
    ? '#ffffff'
    : progress > 0.4
      ? '#ffeb3b'
      : progress > 0.2
        ? '#ff9800'
        : '#f44336';
  const opacity = progress < 0.15
    ? 0.4 + 0.6 * Math.abs(Math.sin(Date.now() * 0.01))
    : 0.95;
  const isFirstWave = wave === 0;

  return (
    <View style={styles.container} pointerEvents="none">
      <Text
        style={[
          styles.number,
          {
            color,
            opacity,
            transform: [{ scale }, { translateX: shakeX }],
          },
        ]}
      >
        {Math.ceil(value)}
      </Text>
      <Text style={[styles.label, { opacity: 0.7 + (1 - progress) * 0.3 }]}>
        {isFirstWave ? 'GET READY' : 'NEXT WAVE'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  number: {
    fontSize: 72,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    letterSpacing: 2,
  },
});
