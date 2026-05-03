// Mapping tower/enemy/projectile/base/ground types to Kenney tile sprites.
// Numbers derived from colour-classification of the Kenney TD top-down pack.

/* eslint-disable global-require */

export const groundSprites = {
  grass: require('../../assets/sprites/raw/kenney-default/towerDefense_tile038.png'),
  path:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile001.png'),
};

export const towerSprites = {
  basic: require('../../assets/sprites/raw/kenney-default/towerDefense_tile180.png'),
  ice:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile181.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile182.png'),
};

export const enemySprites = {
  goblin: require('../../assets/sprites/raw/kenney-default/towerDefense_tile204.png'),
  orc:    require('../../assets/sprites/raw/kenney-default/towerDefense_tile205.png'),
  boss:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile208.png'),
};

export const projectileSprites = {
  basic: require('../../assets/sprites/raw/kenney-default/towerDefense_tile225.png'),
  ice:   require('../../assets/sprites/raw/kenney-default/towerDefense_tile226.png'),
  bomb:  require('../../assets/sprites/raw/kenney-default/towerDefense_tile227.png'),
};

export const baseSprite = require('../../assets/sprites/raw/kenney-default/towerDefense_tile130.png');
