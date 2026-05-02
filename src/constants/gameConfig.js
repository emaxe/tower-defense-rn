import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Сетка — логические единицы (40px = 1 tile). Рендер SVG растягивается на весь экран.
export const GRID_COLS = 12;
export const GRID_ROWS = 8;
export const TILE_SIZE = 40;                     // логический размер 1 тайла
export const BOARD_WIDTH = GRID_COLS * TILE_SIZE;  // 480
export const BOARD_HEIGHT = GRID_ROWS * TILE_SIZE; // 320
export const SCREEN_W = width;
export const SCREEN_H = height;

// Цвета
export const COLORS = {
  grass: '#4a8c4a',
  grassDark: '#3d7a3d',
  path: '#c2a060',
  pathDark: '#a88850',
  uiBg: 'rgba(0,0,0,0.7)',
  gold: '#ffd700',
  hp: '#ff4444',
  basicTower: '#4488cc',
  iceTower: '#44ccdd',
  bombTower: '#cc4444',
  enemyGoblin: '#cc4444',
  enemyOrc: '#884444',
  enemyBoss: '#aa2222',
};

// Башни
export const TOWER_TYPES = {
  basic: {
    name: 'Basic',
    cost: 50,
    damage: 10,
    range: 3,
    cooldown: 1.0,
    color: COLORS.basicTower,
    projectileSpeed: 8,
  },
  ice: {
    name: 'Ice',
    cost: 100,
    damage: 5,
    range: 3,
    cooldown: 1.25,
    color: COLORS.iceTower,
    projectileSpeed: 7,
    effect: { type: 'slow', factor: 0.5, duration: 2.0 },
  },
  bomb: {
    name: 'Bomb',
    cost: 150,
    damage: 20,
    range: 2.5,
    cooldown: 2.0,
    color: COLORS.bombTower,
    projectileSpeed: 5,
    splashRadius: 1.5,
  },
};

// Враги
export const ENEMY_TYPES = {
  goblin: {
    hp: 30,
    speed: 2.0,
    reward: 10,
    radius: 0.3,
    color: COLORS.enemyGoblin,
  },
  orc: {
    hp: 80,
    speed: 1.2,
    reward: 20,
    radius: 0.4,
    color: COLORS.enemyOrc,
  },
  boss: {
    hp: 300,
    speed: 0.8,
    reward: 100,
    radius: 0.55,
    color: COLORS.enemyBoss,
  },
};

// Волны
export const WAVES = [
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

// Стартовые ресурсы
export const START_GOLD = 150;
export const START_LIVES = 20;
