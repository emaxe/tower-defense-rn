import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import GameEngine from '../ecs/engine/GameEngine';
import BoardRenderer from '../ecs/renderers/BoardRenderer';
import GameLoopSystem from '../ecs/systems/GameLoopSystem';
import GameManager from '../ecs/GameManager';
import HUD from '../components/HUD';
import TowerMenu from '../components/TowerMenu';
import WaveCountdown from '../components/WaveCountdown';
import audio from '../audio/AudioManager';

export default function GameScreen({ onNavigate }) {
  const gmRef = useRef(new GameManager());
  const gm = gmRef.current;

  const [uiState, setUiState] = useState(gm.getStateSnapshot());
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    gm.onStateChange = (snapshot) => {
      setUiState(snapshot);
      if (snapshot.state === 'gameover') {
        setScreen('gameover');
      } else if (snapshot.state === 'victory') {
        setScreen('victory');
      }
    };

    audio.init().catch(() => {
      console.log('Audio init failed, continuing silently');
    });

    return () => {
      gm.onStateChange = null;
    };
  }, [gm]);

  const handleStart = useCallback(() => {
    gm.startGame();
    setScreen('playing');
  }, [gm]);

  const handlePause = useCallback(() => {
    gm.togglePause();
  }, [gm]);

  const handleSpeed = useCallback(() => {
    gm.toggleSpeed();
  }, [gm]);

  const handleHome = useCallback(() => {
    gm.stop();
    onNavigate('menu');
  }, [gm, onNavigate]);

  const handleRestart = useCallback(() => {
    gm.stop();
    setScreen('splash');
  }, [gm]);

  const handleDeselect = useCallback(() => {
    gm.deselectTile();
  }, [gm]);

  const handleBuild = useCallback((type, x, y) => {
    gm.buildTower(type, x, y);
  }, [gm]);

  const handleUpgrade = useCallback((x, y) => {
    gm.upgradeTowerAt(x, y);
  }, [gm]);

  const handleSell = useCallback((x, y) => {
    gm.sellTowerAt(x, y);
  }, [gm]);

  const entities = useMemo(() => ({
    gameManager: gm,
    board: {
      renderer: <BoardRenderer />,
      gameManager: gm,
    },
  }), [gm]);

  const running = uiState.state === 'playing';
  const systems = useMemo(() => [GameLoopSystem], []);

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

  if (screen === 'gameover') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>GAME OVER</Text>
          <Text style={styles.splashSubtitle}>
            Waves survived: {Math.max(0, uiState.wave - 1)}
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

  if (screen === 'victory') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>VICTORY!</Text>
          <Text style={styles.splashSubtitle}>
            All waves defeated! Enemies killed: {uiState.enemiesKilled}
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
      <View style={styles.boardWrapper}>
        <GameEngine
          style={styles.engine}
          systems={systems}
          entities={entities}
          running={running}
        />
      </View>

      <View style={styles.uiLayer} pointerEvents="box-none">
        {uiState.countdownActive && (
          <WaveCountdown
            value={uiState.countdownValue}
            total={uiState.countdownTotal}
            wave={uiState.wave}
          />
        )}

        <View pointerEvents="auto">
          <HUD
            gameState={uiState}
            onPause={handlePause}
            onSpeed={handleSpeed}
          />
        </View>

        {uiState.selectedTile && (
          <View pointerEvents="auto" style={styles.towerMenuContainer}>
            <TowerMenu
              gameState={uiState}
              onBuild={handleBuild}
              onUpgrade={handleUpgrade}
              onSell={handleSell}
              onDeselect={handleDeselect}
              canBuild={gm.canBuild.bind(gm)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2a1a',
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  engine: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  uiLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  towerMenuContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
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
