import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function MenuScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏰 Tower Defense</Text>
      <Text style={styles.subtitle}>Защити базу от волн врагов!</Text>

      <TouchableOpacity style={styles.playBtn} onPress={onStart}>
        <Text style={styles.playText}>▶️ Играть</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoText}>📱 React Native + SVG</Text>
        <Text style={styles.infoText}>🎯 10 волн, 3 типа башен</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
    textAlign: 'center',
  },
  playBtn: {
    backgroundColor: '#4488cc',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  playText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#888',
    fontSize: 14,
  },
});

export default MenuScreen;
