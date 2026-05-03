import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function HUD({ gameState, onPause, onSpeed }) {
  const { gold, baseHealth, baseMaxHealth, wave, totalWaves, waveActive, speedMultiplier, state } = gameState;
  const baseHpPercent = baseMaxHealth > 0 ? (baseHealth || 0) / baseMaxHealth : 0;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.topBar}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statText}>{gold}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🏰</Text>
          <Text style={[styles.statText, baseHpPercent <= 0.25 && styles.danger]}>
            {baseHealth}/{baseMaxHealth}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🌊</Text>
          <Text style={styles.statText}>
            {wave}/{totalWaves}
          </Text>
        </View>
      </View>

      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.btn} onPress={onPause}>
          <Text style={styles.btnText}>{state === 'paused' ? '▶️' : '⏸️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, speedMultiplier === 2 && styles.activeBtn]}
          onPress={onSpeed}
        >
          <Text style={styles.btnText}>⏩×{speedMultiplier}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 18,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
  },
  danger: {
    color: '#ff4444',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: 'rgba(200,150,50,0.8)',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
  },
});

export default React.memo(HUD);
