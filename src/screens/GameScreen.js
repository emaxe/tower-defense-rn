import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import engine from '../engine/GameEngine';
import GameLoop from '../engine/GameLoop';
import GameBoard from '../components/GameBoard';
import HUD from '../components/HUD';
import TowerMenu from '../components/TowerMenu';
import audio from '../audio/AudioManager';

function GameScreen({ onGameOver, onVictory, onMenu }) {
  const [uiState, setUiState] = useState({
    state: 'menu',
    gold: 0,
    lives: 0,
    wave: 0,
    totalWaves: 0,
    waveActive: false,
    enemiesKilled: 0,
    selectedTile: null,
    speedMultiplier: 1,
  });

  const callbacksRef = useRef({ onGameOver, onVictory, onMenu });
  useEffect(() => {
    callbacksRef.current = { onGameOver, onVictory, onMenu };
  });

  useEffect(() => {
    // Аудио инициализируем асинхронно, НЕ блокируя старт игры
    audio.init().catch(() => {});

    engine.onStateChange = (newState) => {
      setUiState(newState);
      if (newState.state === 'gameover') {
        callbacksRef.current.onGameOver?.(newState);
      } else if (newState.state === 'victory') {
        callbacksRef.current.onVictory?.(newState);
      }
    };
    engine.reset();
    engine.startGame();
    const loop = new GameLoop(engine);
    loop.start();

    return () => {
      loop.stop();
      engine.onStateChange = null;
      audio.unload();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <GameBoard gameState={uiState} />
      </View>
      <View style={styles.hudContainer}>
        <HUD gameState={uiState} />
      </View>
      <View style={styles.menuContainer}>
        <TowerMenu gameState={uiState} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a0a',
  },
  boardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default GameScreen;
