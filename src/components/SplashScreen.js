import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SplashScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Tower Defense</Text>
      <Text style={styles.subtitle}>Защити базу от волн врагов!</Text>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>▶ НАЧАТЬ ИГРУ</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Тапай по зелёным клеткам → строй башни</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1f0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2a6a2a',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a8c4a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 32,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
