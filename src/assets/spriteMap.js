// Mapping tower/enemy/projectile/base types to Kenney tile sprites.
// Adjust numbers here if visual appearance needs tuning.

/* eslint-disable global-require */

export const towerSprites = {
  basic: require('../../assets/sprites/raw/kenney-default/towerDefense_tile245.png'),
  ice:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile246.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile247.png'),
};

export const enemySprites = {
  goblin: require('../../assets/sprites/raw/kenney-default/towerDefense_tile250.png'),
  orc:    require('../../assets/sprites/raw/kenney-default/towerDefense_tile251.png'),
  boss:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile252.png'),
};

export const projectileSprites = {
  basic: require('../../assets/sprites/raw/kenney-default/towerDefense_tile290.png'),
  ice:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile291.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile292.png'),
};

export const baseSprite = require('../../assets/sprites/raw/kenney-default/towerDefense_tile230.png');
