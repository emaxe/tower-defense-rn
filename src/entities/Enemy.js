import { ENEMY_TYPES } from '../constants/gameConfig';
import generateId from '../utils/id';

export function createEnemy(type, waypoints, tileSize) {
  const config = ENEMY_TYPES[type];
  return {
    id: generateId('enemy'),
    type,
    x: waypoints[0].x * tileSize + tileSize / 2,
    y: waypoints[0].y * tileSize + tileSize / 2,
    hp: config.hp,
    maxHp: config.hp,
    speed: config.speed,
    radius: config.radius,
    color: config.color,
    reward: config.reward,
    damageToBase: config.baseDamage || 5,
    pathProgress: 0,
    active: true,
    effects: {},
  };
}

export function updateEnemy(enemy, waypoints, tileSize, dt) {
  if (!enemy.active) return;

  let speed = enemy.speed;
  if (enemy.effects.slow) {
    speed *= enemy.effects.slow.factor;
    enemy.effects.slow.remaining -= dt;
    if (enemy.effects.slow.remaining <= 0) {
      delete enemy.effects.slow;
    }
  }

  const wpIndex = Math.floor(enemy.pathProgress);
  if (wpIndex >= waypoints.length - 1) {
    enemy.active = false;
    return 'reached_base';
  }

  const a = waypoints[wpIndex];
  const b = waypoints[wpIndex + 1];
  const ax = a.x * tileSize + tileSize / 2;
  const ay = a.y * tileSize + tileSize / 2;
  const bx = b.x * tileSize + tileSize / 2;
  const by = b.y * tileSize + tileSize / 2;

  const segLen = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
  const segProgress = enemy.pathProgress - wpIndex;
  const moveAmount = (speed * tileSize * dt) / segLen;
  const newProgress = segProgress + moveAmount;

  if (newProgress >= 1) {
    enemy.pathProgress = wpIndex + 1;
    enemy.x = bx;
    enemy.y = by;
  } else {
    enemy.pathProgress = wpIndex + newProgress;
    enemy.x = ax + (bx - ax) * newProgress;
    enemy.y = ay + (by - ay) * newProgress;
  }

  return null;
}
