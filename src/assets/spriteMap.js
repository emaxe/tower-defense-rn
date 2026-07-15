// Mapping tower/enemy/projectile/base/ground types to Kenney tile sprites.
// Numbers derived from colour-classification of the Kenney TD top-down pack.

/* eslint-disable global-require */

export const groundSprites = {
  grass: require('../../assets/sprites/raw/kenney-default/towerDefense_tile038.png'),
};

export const towerSprites = {
  basic: require('../../assets/sprites/custom/turret_archer.png'),
  ice:   require('../../assets/sprites/custom/tower_mage.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile291.png'),
};

export const towerBaseSprites = {
  basic: require('../../assets/sprites/custom/base_archer.png'),
  ice:   require('../../assets/sprites/custom/base_archer.png'), // TODO: replace with base_mage.png when ready
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile291.png'),
};

export const enemySprites = {
  goblin: require('../../assets/sprites/raw/kenney-default/towerDefense_tile245.png'),
  orc:    require('../../assets/sprites/raw/kenney-default/towerDefense_tile249.png'),
  boss:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile249.png'),
};

export const projectileSprites = {
  basic: require('../../assets/sprites/raw/kenney-default/towerDefense_tile290.png'),
  ice:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile292.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile248.png'),
};

export const baseSprite = require('../../assets/sprites/custom/base.png');
