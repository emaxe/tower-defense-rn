import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import engine from '../engine/GameEngine';

function HUD({ gameState }) {
  const { gold, lives, wave, totalWaves, waveActive, speedMultiplier } = gameState;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statText}>{gold}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statText, lives <= 5 && styles.danger]}>{lives}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🌊</Text>
          <Text style={styles.statText}>
            {wave}/{totalWaves}
          </Text>
        </View>
      </View>

      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.btn} onPress={() => engine.togglePause()}>
          <Text style={styles.btnText}>{gameState.state === 'paused' ? '▶️' : '⏸️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, speedMultiplier === 2 && styles.activeBtn]}
          onPress={() => engine.setSpeed(speedMultiplier === 1 ? 2 : 1)}
        >
          <Text style={styles.btnText}>⏩×{speedMultiplier}</Text>
        </TouchableOpacity>
      </View>

      {!waveActive && gameState.state === 'playing' && wave < totalWaves && (
        <View style={styles.nextWaveBanner}>
          <Text style={styles.nextWaveText}>Волна завершена! Следующая через 2с...</Text>
        </View>
      )}
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
    pointerEvents: 'box-none',
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
  nextWaveBanner: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextWaveText: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 8,
  },
});

export default React.memo(HUD);
