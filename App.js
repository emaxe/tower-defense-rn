import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const [screen, setScreen] = useState('menu');

  const handleNavigate = useCallback((target) => {
    setScreen(target);
  }, []);

  const handleStart = useCallback(() => {
    setScreen('game');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'game' && <GameScreen onNavigate={handleNavigate} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a0a',
  },
});
