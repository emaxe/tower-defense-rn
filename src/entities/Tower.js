import { TOWER_TYPES, TILE_SIZE } from '../constants/gameConfig';
import generateId from '../utils/id';

export function createTower(type, tileX, tileY) {
  const config = TOWER_TYPES[type];
  return {
    id: generateId('tower'),
    type,
    tileX,
    tileY,
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
    level: 1,
    range: config.range * TILE_SIZE,
    damage: config.damage,
    cooldown: config.cooldown,
    cooldownRemaining: 0,
    color: config.color,
    targetId: null,
    angle: 0,
    config,
  };
}

export function upgradeTower(tower) {
  if (tower.level >= 3) return false;
  tower.level += 1;
  tower.damage = Math.floor(tower.damage * 1.5);
  tower.range += TILE_SIZE * 0.5;
  tower.cooldown *= 0.85;
  return true;
}

export function getUpgradeCost(tower) {
  const base = tower.config.cost;
  return Math.floor(base * tower.level * 0.8);
}

export function getSellValue(tower) {
  const base = tower.config.cost;
  return Math.floor(base * tower.level * 0.5);
}
