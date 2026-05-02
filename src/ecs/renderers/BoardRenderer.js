import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Polygon, Text as SvgText, G } from 'react-native-svg';
import {
  TILE_SIZE,
  GRID_COLS,
  GRID_ROWS,
  COLORS,
} from '../../constants/gameConfig';

const { width: INIT_W, height: INIT_H } = Dimensions.get('window');

function BoardRenderer({ gameManager }) {
  const [, forceUpdate] = useState(0);
  const rafRef = useRef(null);
  const mountedRef = useRef(true);
  const [layout, setLayout] = useState({ width: INIT_W, height: INIT_H });

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setLayout({ width: window.width, height: window.height });
    });
    return () => sub?.remove();
  }, []);

  const scheduleRender = useCallback(() => {
    if (rafRef.current || !mountedRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!mountedRef.current) return;
      forceUpdate((n) => n + 1);
      if (gameManager.state === 'playing' || gameManager.state === 'paused') {
        scheduleRender();
      }
    });
  }, [gameManager]);

  useEffect(() => {
    mountedRef.current = true;
    scheduleRender();
    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleRender]);

  const handleLayout = useCallback((evt) => {
    const { width, height } = evt.nativeEvent.layout;
    setLayout({ width, height });
  }, []);

  const tileSizePx = Math.min(layout.width / GRID_COLS, layout.height / GRID_ROWS);
  const boardW = tileSizePx * GRID_COLS;
  const boardH = tileSizePx * GRID_ROWS;

  const handlePress = useCallback(
    (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const tileX = Math.floor(locationX / tileSizePx);
      const tileY = Math.floor(locationY / tileSizePx);
      if (tileX >= 0 && tileX < GRID_COLS && tileY >= 0 && tileY < GRID_ROWS) {
        gameManager.selectTile(tileX, tileY);
        forceUpdate((n) => n + 1);
      }
    },
    [tileSizePx, gameManager]
  );

  const gm = gameManager;
  const map = gm.buildable || [];
  const selected = gm.selectedTile;
  const selectedTower = selected ? gm.getTowerAt(selected.x, selected.y) : null;

  const vbW = GRID_COLS * TILE_SIZE;
  const vbH = GRID_ROWS * TILE_SIZE;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ width: boardW, height: boardH, backgroundColor: '#0d1f0d' }}>
          <Svg width={boardW} height={boardH} viewBox={`0 0 ${vbW} ${vbH}`}>
            <Rect x={0} y={0} width={vbW} height={vbH} fill="#1a2a1a" />

            {map.length > 0 && Array.from({ length: GRID_ROWS }).map((_, row) =>
              Array.from({ length: GRID_COLS }).map((_, col) => {
                const isPath = map[row] ? !map[row][col] : false;
                const color = isPath
                  ? (row + col) % 2 === 0 ? COLORS.path : COLORS.pathDark
                  : (row + col) % 2 === 0 ? COLORS.grass : COLORS.grassDark;
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

            {gm.towers?.map((t) => (
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

            {gm.enemies?.map((e) => {
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

            {gm.projectiles?.map((p) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1f0d',
  },
});

export default React.memo(BoardRenderer);
