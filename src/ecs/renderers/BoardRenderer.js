import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Polygon, Text as SvgText, G, Image as SvgImage, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import {
  TILE_SIZE,
  GRID_COLS,
  GRID_ROWS,
  COLORS,
} from '../../constants/gameConfig';
import { groundSprites, towerSprites, towerBaseSprites, enemySprites, projectileSprites, baseSprite } from '../../assets/spriteMap';

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
            <Defs>
              <RadialGradient id="hitFlashGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#ff5555" stopOpacity="0.55" />
                <Stop offset="65%" stopColor="#ff0000" stopOpacity="0.15" />
                <Stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={vbW} height={vbH} fill="#1a2a1a" />

            {/* Ground tiles (grass everywhere, path drawn as overlay) */}
            {map.length > 0 && Array.from({ length: GRID_ROWS }).map((_, row) =>
              Array.from({ length: GRID_COLS }).map((_, col) => (
                <SvgImage
                  key={`g-${row}-${col}`}
                  x={col * TILE_SIZE}
                  y={row * TILE_SIZE}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  href={groundSprites.grass}
                />
              ))
            )}

            {/* Road path overlay */}
            {(() => {
              const pathCoords = [];
              for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                  if (map[r] && !map[r][c]) {
                    pathCoords.push({ x: c, y: r });
                  }
                }
              }

              const nodes = new Set(pathCoords.map((p) => `${p.x},${p.y}`));
              const cx = (c) => c * TILE_SIZE + TILE_SIZE / 2;
              const cy = (r) => r * TILE_SIZE + TILE_SIZE / 2;
              const R = TILE_SIZE * 0.42;
              const SW = TILE_SIZE * 0.84;
              const roadColor = '#B8894A';

              const lines = [];
              pathCoords.forEach((p, i) => {
                const right = nodes.has(`${p.x + 1},${p.y}`);
                const down = nodes.has(`${p.x},${p.y + 1}`);
                if (right) {
                  lines.push(
                    <Line
                      key={`h-${p.x}-${p.y}`}
                      x1={cx(p.x)}
                      y1={cy(p.y)}
                      x2={cx(p.x + 1)}
                      y2={cy(p.y)}
                      stroke={roadColor}
                      strokeWidth={SW}
                      strokeLinecap="round"
                    />
                  );
                }
                if (down) {
                  lines.push(
                    <Line
                      key={`v-${p.x}-${p.y}`}
                      x1={cx(p.x)}
                      y1={cy(p.y)}
                      x2={cx(p.x)}
                      y2={cy(p.y + 1)}
                      stroke={roadColor}
                      strokeWidth={SW}
                      strokeLinecap="round"
                    />
                  );
                }
              });

              return [
                ...lines,
                ...pathCoords.map((p) => (
                  <Circle
                    key={`n-${p.x}-${p.y}`}
                    cx={cx(p.x)}
                    cy={cy(p.y)}
                    r={R}
                    fill={roadColor}
                  />
                )),
              ];
            })()}

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
              const turretSize = TILE_SIZE * 0.65;
              const towerAngle = (t.angle * 180) / Math.PI;
              return (
                <G key={t.id} transform={`translate(${t.x},${t.y})`}>
                  {/* Tower base — static platform */}
                  <SvgImage
                    x={-size / 2}
                    y={-size / 2}
                    width={size}
                    height={size}
                    href={towerBaseSprites[t.type] || towerBaseSprites.basic}
                  />
                  {/* Tower turret — rotates toward target */}
                  <G transform={`rotate(${towerAngle})`}>
                    <SvgImage
                      x={-turretSize / 2}
                      y={-turretSize / 2}
                      width={turretSize}
                      height={turretSize}
                      href={towerSprites[t.type] || towerSprites.basic}
                    />
                  </G>
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
              const enemyAngle = (e.angle * 180) / Math.PI;
              const bob = Math.sin(e.pathProgress * Math.PI * 2 * 6) * 3;
              const scale = e.spawnScale ?? 1;
              return (
                <G key={e.id}>
                  {/* Enemy sprite with bobbing, rotation and spawn scale */}
                  <G transform={`translate(${e.x},${e.y + bob})`}>
                    <G transform={`rotate(${enemyAngle}) scale(${scale})`}>
                      <SvgImage
                        x={-size / 2}
                        y={-size / 2}
                        width={size}
                        height={size}
                        href={enemySprites[e.type] || enemySprites.goblin}
                      />
                      {e.hitFlash > 0 && (
                        <Circle
                          cx={0}
                          cy={0}
                          r={size * 0.42}
                          fill="url(#hitFlashGrad)"
                          opacity={Math.min(0.9, e.hitFlash * 6)}
                        />
                      )}
                    </G>
                  </G>
                  {/* HP bar stays upright, no rotation */}
                  <Rect
                    x={e.x - TILE_SIZE * 0.25}
                    y={e.y - TILE_SIZE * 0.5 + bob}
                    width={TILE_SIZE * 0.5 * hpPercent}
                    height={4}
                    fill={hpPercent > 0.5 ? '#4caf50' : hpPercent > 0.25 ? '#ff9800' : '#f44336'}
                  />
                  <Rect
                    x={e.x - TILE_SIZE * 0.25}
                    y={e.y - TILE_SIZE * 0.5 + bob}
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
