import generateId from '../utils/id';
import { TILE_SIZE } from '../constants/gameConfig';

export function createProjectile(tower, targetEnemy, type = 'basic') {
  const config = tower.config;
  return {
    id: generateId('proj'),
    type,
    x: tower.x,
    y: tower.y,
    targetId: targetEnemy.id,
    damage: tower.damage,
    speed: (config.projectileSpeed || 8) * TILE_SIZE,
    color: config.color,
    splashRadius: config.splashRadius ? config.splashRadius * TILE_SIZE : 0,
    effect: config.effect || null,
    active: true,
  };
}

export function updateProjectile(proj, target, dt) {
  if (!proj.active || !target || !target.active) {
    proj.active = false;
    return null;
  }

  const dx = target.x - proj.x;
  const dy = target.y - proj.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const moveDist = proj.speed * dt;

  if (dist <= moveDist + target.radius * TILE_SIZE * 0.5) {
    proj.active = false;
    return {
      hit: true,
      targetId: target.id,
      damage: proj.damage,
      splashRadius: proj.splashRadius,
      effect: proj.effect,
      x: target.x,
      y: target.y,
    };
  }

  proj.x += (dx / dist) * moveDist;
  proj.y += (dy / dist) * moveDist;
  return null;
}
