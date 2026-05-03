import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Polygon, Text as SvgText, G, Image as SvgImage } from 'react-native-svg';
import {
  TILE_SIZE,
  GRID_COLS,
  GRID_ROWS,
  COLORS,
} from '../../constants/gameConfig';
import { towerSprites, enemySprites, projectileSprites, baseSprite } from '../../assets/spriteMap';

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

            {gm.towers?.map((t) => {
              const size = TILE_SIZE * 0.8;
              return (
                <G key={t.id} transform={`translate(${t.x},${t.y}) rotate(${(t.angle * 180) / Math.PI + 90})`}>
                  <SvgImage
                    x={-size / 2}
                    y={-size / 2}
                    width={size}
                    height={size}
                    href={towerSprites[t.type] || towerSprites.basic}
                  />
                  <SvgText
                    x={0}
                    y={4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={TILE_SIZE * 0.25}
                    fontWeight="bold"
                  >
                    {t.level}
                  </SvgText>
                </G>
              );
            })}

            {gm.enemies?.map((e) => {
              if (!e.active) return null;
              const hpPercent = e.hp / e.maxHp;
              const size = TILE_SIZE * 0.8;
              return (
                <G key={e.id}>
                  <SvgImage
                    x={e.x - size / 2}
                    y={e.y - size / 2}
                    width={size}
                    height={size}
                    href={enemySprites[e.type] || enemySprites.goblin}
                  />
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
              const size = TILE_SIZE * 0.3;
              return (
                <SvgImage
                  key={p.id}
                  x={p.x - size / 2}
                  y={p.y - size / 2}
                  width={size}
                  height={size}
                  href={projectileSprites[p.type] || projectileSprites.basic}
                />
              );
            })}

            {/* Base rendering */}
            {(() => {
              const lastWp = gm.waypoints[gm.waypoints.length - 1];
              if (!lastWp) return null;
              const bx = lastWp.x * TILE_SIZE + TILE_SIZE / 2;
              const by = lastWp.y * TILE_SIZE + TILE_SIZE / 2;
              const baseHpPercent = Math.max(0, (gm.baseHealth || 0) / (gm.baseMaxHealth || 1));
              const barW = TILE_SIZE * 0.8;
              const barH = 5;
              const barX = bx - barW / 2;
              const barY = by - TILE_SIZE * 0.55;
              const size = TILE_SIZE * 0.9;
              return (
                <G>
                  <SvgImage
                    x={bx - size / 2}
                    y={by - size / 2}
                    width={size}
                    height={size}
                    href={baseSprite}
                  />
                  {/* Base HP bar background */}
                  <Rect
                    x={barX}
                    y={barY}
                    width={barW}
                    height={barH}
                    fill={COLORS.baseHpBg}
                    rx={2}
                  />
                  {/* Base HP bar fill */}
                  <Rect
                    x={barX}
                    y={barY}
                    width={barW * baseHpPercent}
                    height={barH}
                    fill={baseHpPercent > 0.5 ? '#4caf50' : baseHpPercent > 0.25 ? '#ff9800' : '#f44336'}
                    rx={2}
                  />
                  {/* Base label */}
                  <SvgText
                    x={bx}
                    y={by + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={TILE_SIZE * 0.22}
                    fontWeight="bold"
                  >
                    BASE
                  </SvgText>
                </G>
              );
            })()}
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
