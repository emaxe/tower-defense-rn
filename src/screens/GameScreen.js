import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import GameBoard from '../components/GameBoard';
import HUD from '../components/HUD';
import TowerMenu from '../components/TowerMenu';
import engine from '../engine/GameEngine';
import audio from '../audio/AudioManager';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function GameScreen({ onNavigate }) {
  const [uiState, setUiState] = useState(engine.getStateSnapshot());
  const [screen, setScreen] = useState('splash'); // splash | playing | gameover
  const initRef = useRef(false);

  const syncUI = useCallback(() => {
    setUiState(engine.getStateSnapshot());
    if (engine.state === 'gameover') {
      setScreen('gameover');
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    engine.onStateChange = syncUI;

    // Initialize audio asynchronously without blocking UI
    audio.init().catch(() => {
      // Audio failure is non-critical; game works without sound
      console.log('Audio init failed, continuing silently');
    });

    return () => {
      engine.onStateChange = null;
    };
  }, [syncUI]);

  const handleStart = useCallback(() => {
    engine.startGame();
    setScreen('playing');
    syncUI();
  }, [syncUI]);

  const handlePause = useCallback(() => {
    engine.togglePause();
    syncUI();
  }, [syncUI]);

  const handleSpeed = useCallback(() => {
    engine.toggleSpeed();
    syncUI();
  }, [syncUI]);

  const handleHome = useCallback(() => {
    engine.stop();
    onNavigate('home');
  }, [onNavigate]);

  const handleRestart = useCallback(() => {
    engine.reset();
    setScreen('splash');
    syncUI();
  }, [syncUI]);

  // Splash screen
  if (screen === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>Tower Defense</Text>
          <Text style={styles.splashSubtitle}>
            Build towers. Stop enemies. Survive all waves.
          </Text>
          <TouchableOpacity style={styles.splashButton} onPress={handleStart}>
            <Text style={styles.splashButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Game Over screen
  if (screen === 'gameover') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>GAME OVER</Text>
          <Text style={styles.splashSubtitle}>
            Waves survived: {uiState.wave - 1}
          </Text>
          <TouchableOpacity style={styles.splashButton} onPress={handleRestart}>
            <Text style={styles.splashButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.splashButton, styles.secondaryButton]} onPress={handleHome}>
            <Text style={[styles.splashButtonText, styles.secondaryButtonText]}>MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boardContainer}>
        <GameBoard gameState={uiState} />
      </View>

      <View style={styles.hudOverlay} pointerEvents="box-none">
        <HUD
          gold={uiState.gold}
          lives={uiState.lives}
          wave={uiState.wave}
          maxWave={uiState.maxWave}
          onPause={handlePause}
          onSpeed={handleSpeed}
          isPaused={uiState.isPaused}
          speed={uiState.speed}
        />
      </View>

      {uiState.selectedTile && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <TowerMenu
            gold={uiState.gold}
            selectedTile={uiState.selectedTile}
            towerAtTile={uiState.towerAtTile}
            onBuild={engine.buildTower.bind(engine)}
            onUpgrade={engine.upgradeTower.bind(engine)}
            onSell={engine.sellTower.bind(engine)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2a1a',
  },
  boardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  menuOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#1a2a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    padding: 32,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 2,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#9ea7aa',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  splashButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: 220,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  splashButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButtonText: {
    color: '#ff9800',
  },
});
