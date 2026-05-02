import React, { useRef, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Rect, Circle, Path, Polygon, Text as SvgText, G } from 'react-native-svg';
import {
  TILE_SIZE,
  GRID_COLS,
  GRID_ROWS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  COLORS,
  TOWER_TYPES,
} from '../constants/gameConfig';
import engine from '../engine/GameEngine';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

function GameBoard({ gameState }) {
  const [, forceUpdate] = useState(0);
  const rafRef = useRef(null);

  const scheduleRender = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      forceUpdate((n) => n + 1);
      if (engine.state === 'playing' || engine.state === 'paused') {
        scheduleRender();
      }
    });
  }, []);

  React.useEffect(() => {
    engine.onTick = scheduleRender;
    scheduleRender();
    return () => {
      engine.onTick = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleRender]);

  const handlePress = useCallback((evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    // Переводим физические пиксели в tile-координаты с учётом растяжки viewBox
    const tileX = Math.floor((locationX / SCREEN_W) * GRID_COLS);
    const tileY = Math.floor((locationY / SCREEN_H) * GRID_ROWS);
    if (tileX >= 0 && tileX < GRID_COLS && tileY >= 0 && tileY < GRID_ROWS) {
      engine.selectTile(tileX, tileY);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const map = engine.buildable;
  const selected = engine.selectedTile;
  const selectedTower = selected ? engine.getTowerAt(selected.x, selected.y) : null;

  const wpPath = engine.waypoints
    .map((wp, i) => {
      const x = wp.x * TILE_SIZE + TILE_SIZE / 2;
      const y = wp.y * TILE_SIZE + TILE_SIZE / 2;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Svg
          width={SCREEN_W}
          height={SCREEN_H}
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <Rect x={0} y={0} width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="#1a2a1a" />

          {/* Grid tiles */}
          {Array.from({ length: GRID_ROWS }).map((_, row) =>
            Array.from({ length: GRID_COLS }).map((_, col) => {
              const isPath = !map[row][col];
              const color = isPath
                ? (row + col) % 2 === 0
                  ? COLORS.path
                  : COLORS.pathDark
                : (row + col) % 2 === 0
                  ? COLORS.grass
                  : COLORS.grassDark;
              return (
                <Rect
                  key={`${row}-${col}`}
                  x={col * TILE_SIZE}
                  y={row * TILE_SIZE}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  fill={color}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth={1}
                />
              );
            })
          )}

          {/* Path line */}
          <Path d={wpPath} stroke="#8b6914" strokeWidth={TILE_SIZE * 0.4} opacity={0.6} />

          {/* Selection highlight */}
          {selected && (
            <Rect
              x={selected.x * TILE_SIZE}
              y={selected.y * TILE_SIZE}
              width={TILE_SIZE}
              height={TILE_SIZE}
              fill="rgba(255,255,255,0.2)"
              stroke="white"
              strokeWidth={2}
            />
          )}

          {/* Tower range if selected */}
          {selectedTower && (
            <Circle
              cx={selectedTower.x}
              cy={selectedTower.y}
              r={selectedTower.range}
              fill="none"
              stroke="white"
              strokeWidth={1}
              opacity={0.4}
            />
          )}

          {/* Towers */}
          {engine.towers.map((t) => (
            <G key={t.id}>
              <Rect
                x={t.x - TILE_SIZE * 0.35}
                y={t.y - TILE_SIZE * 0.35}
                width={TILE_SIZE * 0.7}
                height={TILE_SIZE * 0.7}
                fill={t.color}
                stroke="#222"
                strokeWidth={2}
                rx={4}
              />
              <Polygon
                points={`0,-${TILE_SIZE * 0.15} ${TILE_SIZE * 0.25},${TILE_SIZE * 0.1} -${TILE_SIZE * 0.25},${TILE_SIZE * 0.1}`}
                fill="#222"
                transform={`translate(${t.x},${t.y}) rotate(${(t.angle * 180) / Math.PI + 90})`}
              />
              <SvgText
                x={t.x}
                y={t.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize={TILE_SIZE * 0.25}
                fontWeight="bold"
              >
                {t.level}
              </SvgText>
            </G>
          ))}

          {/* Enemies */}
          {engine.enemies.map((e) => {
            if (!e.active) return null;
            const hpPercent = e.hp / e.maxHp;
            return (
              <G key={e.id}>
                <Circle cx={e.x} cy={e.y} r={e.radius * TILE_SIZE} fill={e.color} stroke="#222" strokeWidth={1} />
                <Rect
                  x={e.x - TILE_SIZE * 0.25}
                  y={e.y - TILE_SIZE * 0.5}
                  width={TILE_SIZE * 0.5 * hpPercent}
                  height={4}
                  fill={hpPercent > 0.5 ? '#4caf50' : hpPercent > 0.25 ? '#ff9800' : '#f44336'}
                />
                <Rect
                  x={e.x - TILE_SIZE * 0.25}
                  y={e.y - TILE_SIZE * 0.5}
                  width={TILE_SIZE * 0.5}
                  height={4}
                  fill="none"
                  stroke="#222"
                  strokeWidth={0.5}
                />
              </G>
            );
          })}

          {/* Projectiles */}
          {engine.projectiles.map((p) => {
            if (!p.active) return null;
            return (
              <Circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={TILE_SIZE * 0.1}
                fill={p.color}
                stroke="white"
                strokeWidth={1}
              />
            );
          })}
        </Svg>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
  },
});

export default React.memo(GameBoard);
