import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MenuScreen from './src/screens/MenuScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen from './src/screens/GameScreen';
import { LEVELS } from './src/levels';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleNavigate = useCallback((target) => {
    setScreen(target);
    if (target !== 'game') {
      setSelectedLevel(null);
    }
  }, []);

  const handleStart = useCallback(() => {
    setScreen('levelselect');
  }, []);

  const handleSelectLevel = useCallback((levelId) => {
    const level = LEVELS.find((l) => l.id === levelId);
    if (level) {
      setSelectedLevel(level);
      setScreen('game');
    }
  }, []);

  const handleBack = useCallback(() => {
    setScreen('menu');
    setSelectedLevel(null);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'levelselect' && (
        <LevelSelectScreen onSelect={handleSelectLevel} onBack={handleBack} />
      )}
      {screen === 'game' && selectedLevel && (
        <GameScreen onNavigate={handleNavigate} levelConfig={selectedLevel} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a0a',
  },
});
