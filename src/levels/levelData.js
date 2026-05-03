import { GRID_COLS, GRID_ROWS } from '../constants/gameConfig';

// === Level 1: Forest Path (classic zigzag top-to-bottom) ===
export const LEVEL_1_WAYPOINTS = [
  { x: 1, y: 0 },
  { x: 1, y: 4 },
  { x: 6, y: 4 },
  { x: 6, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 12 },
  { x: 7, y: 12 },
  { x: 7, y: 13 },
];

export const LEVEL_1_WAVES = [
  { count: 5, types: ['goblin'], interval: 1.5 },
  { count: 8, types: ['goblin'], interval: 1.2 },
  { count: 7, types: ['goblin', 'goblin', 'orc'], interval: 1.5 },
  { count: 10, types: ['goblin', 'orc', 'goblin', 'orc'], interval: 1.3 },
  { count: 8, types: ['orc'], interval: 2.0 },
  { count: 12, types: ['goblin', 'orc', 'orc', 'goblin'], interval: 1.2 },
  { count: 15, types: ['orc', 'orc', 'goblin'], interval: 1.0 },
  { count: 10, types: ['orc', 'orc', 'orc', 'boss'], interval: 2.0 },
  { count: 20, types: ['orc', 'orc', 'orc', 'orc'], interval: 0.8 },
  { count: 6, types: ['boss', 'orc', 'boss', 'orc', 'orc', 'boss'], interval: 3.0 },
];

// === Level 2: River Crossing (horizontal zigzag) ===
export const LEVEL_2_WAYPOINTS = [
  { x: 0, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 3 },
  { x: 0, y: 3 },
  { x: 0, y: 5 },
  { x: 7, y: 5 },
  { x: 7, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 9 },
  { x: 7, y: 9 },
  { x: 7, y: 11 },
  { x: 0, y: 11 },
  { x: 0, y: 13 },
];

export const LEVEL_2_WAVES = [
  { count: 6, types: ['goblin'], interval: 1.3 },
  { count: 10, types: ['goblin', 'goblin', 'orc'], interval: 1.2 },
  { count: 8, types: ['orc'], interval: 1.8 },
  { count: 12, types: ['goblin', 'orc', 'orc', 'goblin'], interval: 1.1 },
  { count: 10, types: ['orc', 'orc', 'boss'], interval: 1.8 },
  { count: 15, types: ['goblin', 'orc', 'orc', 'goblin'], interval: 0.9 },
  { count: 12, types: ['orc', 'orc', 'orc'], interval: 1.4 },
  { count: 15, types: ['orc', 'boss', 'orc', 'orc'], interval: 1.2 },
  { count: 20, types: ['orc', 'orc', 'orc', 'orc', 'boss'], interval: 0.8 },
  { count: 10, types: ['boss', 'orc', 'boss', 'orc'], interval: 2.0 },
  { count: 25, types: ['orc', 'orc', 'orc', 'orc'], interval: 0.6 },
  { count: 8, types: ['boss', 'boss', 'orc', 'boss', 'orc', 'boss'], interval: 2.5 },
];

// === Level 3: Snake Pit (tight spiral-like) ===
export const LEVEL_3_WAYPOINTS = [
  { x: 3, y: 0 },
  { x: 3, y: 2 },
  { x: 0, y: 2 },
  { x: 0, y: 5 },
  { x: 6, y: 5 },
  { x: 6, y: 8 },
  { x: 1, y: 8 },
  { x: 1, y: 11 },
  { x: 7, y: 11 },
  { x: 7, y: 13 },
];

export const LEVEL_3_WAVES = [
  { count: 8, types: ['goblin', 'orc'], interval: 1.2 },
  { count: 10, types: ['orc'], interval: 1.5 },
  { count: 12, types: ['goblin', 'orc', 'orc'], interval: 1.0 },
  { count: 10, types: ['orc', 'orc', 'boss'], interval: 1.8 },
  { count: 15, types: ['orc', 'orc', 'orc', 'goblin'], interval: 0.9 },
  { count: 12, types: ['boss', 'orc', 'boss'], interval: 2.0 },
  { count: 18, types: ['orc', 'orc', 'orc', 'orc'], interval: 0.8 },
  { count: 15, types: ['orc', 'boss', 'orc', 'boss', 'orc'], interval: 1.2 },
  { count: 25, types: ['orc', 'orc', 'orc', 'orc', 'boss'], interval: 0.7 },
  { count: 12, types: ['boss', 'orc', 'boss', 'orc', 'boss'], interval: 1.8 },
  { count: 30, types: ['orc', 'orc', 'orc', 'orc'], interval: 0.5 },
  { count: 15, types: ['boss', 'boss', 'orc', 'boss', 'orc', 'boss', 'orc'], interval: 2.0 },
  { count: 10, types: ['boss', 'boss', 'boss', 'orc', 'boss'], interval: 2.5 },
  { count: 40, types: ['orc', 'orc', 'orc', 'orc', 'orc'], interval: 0.4 },
  { count: 10, types: ['boss', 'boss', 'boss', 'boss', 'boss'], interval: 3.0 },
];

export function generateBuildableMap(waypoints) {
  const map = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(true));

  const pathTiles = new Set();
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (a.x === b.x) {
      const minY = Math.min(a.y, b.y);
      const maxY = Math.max(a.y, b.y);
      for (let y = minY; y <= maxY; y++) {
        if (a.x >= 0 && a.x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
          pathTiles.add(`${a.x},${y}`);
        }
      }
    } else {
      const minX = Math.min(a.x, b.x);
      const maxX = Math.max(a.x, b.x);
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < GRID_COLS && a.y >= 0 && a.y < GRID_ROWS) {
          pathTiles.add(`${x},${a.y}`);
        }
      }
    }
  }

  pathTiles.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    if (y >= 0 && y < GRID_ROWS && x >= 0 && x < GRID_COLS) {
      map[y][x] = false;
    }
  });

  return map;
}
