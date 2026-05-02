import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function GameOverScreen({ isVictory, stats, onRestart, onMenu }) {
  const title = isVictory ? '🎉 Победа!' : '💀 Поражение';
  const color = isVictory ? '#4caf50' : '#f44336';

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <Text style={[styles.title, { color }]}>{title}</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>🌊 Волна: {stats.wave}/{stats.totalWaves}</Text>
          <Text style={styles.stat}>💰 Золото: {stats.gold}</Text>
          <Text style={styles.stat}>⚔️ Убито: {stats.enemiesKilled}</Text>
        </View>

        <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onRestart}>
          <Text style={styles.btnText}>🔄 Ещё раз</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.menuBtn]} onPress={onMenu}>
          <Text style={styles.btnText}>🏠 Меню</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  panel: {
    backgroundColor: '#1a2a1a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stats: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  stat: {
    color: '#ccc',
    fontSize: 16,
  },
  btn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    minWidth: 160,
    alignItems: 'center',
  },
  menuBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GameOverScreen;
