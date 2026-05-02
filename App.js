import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [gameResult, setGameResult] = useState(null);

  const handleStart = useCallback(() => {
    setGameResult(null);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback(
    (stats) => {
      setGameResult({ isVictory: false, stats });
      setScreen('gameover');
    },
    []
  );

  const handleVictory = useCallback(
    (stats) => {
      setGameResult({ isVictory: true, stats });
      setScreen('gameover');
    },
    []
  );

  const handleMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'menu' && <MenuScreen onStart={handleStart} />}
      {screen === 'game' && (
        <GameScreen onGameOver={handleGameOver} onVictory={handleVictory} onMenu={handleMenu} />
      )}
      {screen === 'gameover' && gameResult && (
        <GameOverScreen
          isVictory={gameResult.isVictory}
          stats={gameResult.stats}
          onRestart={handleStart}
          onMenu={handleMenu}
        />
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
