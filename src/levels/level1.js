import { GRID_COLS, GRID_ROWS } from '../constants/gameConfig';

// Waypoints в координатах тайлов (tileX, tileY) — зигзаг сверху вниз
export const WAYPOINTS = [
  { x: 1, y: 0 },   // Старт (верх)
  { x: 1, y: 4 },
  { x: 6, y: 4 },
  { x: 6, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 12 },
  { x: 7, y: 12 },
  { x: 7, y: 13 },  // Финиш (низ)
];

// Карта: true = можно строить, false = путь или база
export function generateBuildableMap() {
  const map = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(true));

  // Отметить путь как нестроительный
  const pathTiles = new Set();
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
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
