import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TOWER_TYPES, TILE_SIZE } from '../constants/gameConfig';
import { getUpgradeCost, getSellValue } from '../entities/Tower';

const MENU_H = 140;

function TowerMenu({ gameState, onBuild, onUpgrade, onSell, onDeselect, canBuild }) {
  const { selectedTile, gold, towerAtTile } = gameState;
  if (!selectedTile) return null;

  const { x, y } = selectedTile;
  const tower = towerAtTile;
  const canBuildHere = canBuild ? canBuild(x, y) : false;

  const handleUpgrade = () => {
    onUpgrade && onUpgrade(x, y);
  };

  const handleSell = () => {
    onSell && onSell(x, y);
  };

  const handleBuild = (key) => {
    onBuild && onBuild(key, x, y);
  };

  const handleClose = () => {
    onDeselect && onDeselect();
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        {tower ? (
          <>
            <Text style={styles.title}>
              {tower.config.name} (ур. {tower.level})
            </Text>
            <View style={styles.row}>
              {tower.level < 3 && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleUpgrade}
                >
                  <Text style={styles.btnText}>⬆️ Улучшить</Text>
                  <Text style={styles.costText}>{getUpgradeCost(tower)} 💰</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionBtn, styles.sellBtn]}
                onPress={handleSell}
              >
                <Text style={styles.btnText}>💰 Продать</Text>
                <Text style={styles.costText}>{getSellValue(tower)} 💰</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : canBuildHere ? (
          <>
            <Text style={styles.title}>Построить башню</Text>
            <View style={styles.row}>
              {Object.entries(TOWER_TYPES).map(([key, config]) => {
                const affordable = gold >= config.cost;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.buildBtn, !affordable && styles.disabledBtn]}
                    onPress={() => handleBuild(key)}
                    disabled={!affordable}
                  >
                    <View
                      style={[styles.colorDot, { backgroundColor: config.color }]}
                    />
                    <Text style={styles.btnText}>{config.name}</Text>
                    <Text style={styles.costText}>{config.cost} 💰</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={styles.title}>Здесь нельзя строить</Text>
        )}
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeText}>❌ Закрыть</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  panel: {
    backgroundColor: 'rgba(20,30,20,0.95)',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  buildBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  sellBtn: {
    backgroundColor: 'rgba(200,50,50,0.3)',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  btnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  costText: {
    color: '#ffd700',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    marginTop: 8,
    alignSelf: 'center',
    padding: 4,
  },
  closeText: {
    color: '#aaa',
    fontSize: 13,
  },
});

export default React.memo(TowerMenu);
