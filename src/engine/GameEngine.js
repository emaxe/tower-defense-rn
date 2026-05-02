import {
  TILE_SIZE,
  GRID_COLS,
  GRID_ROWS,
  START_GOLD,
  START_LIVES,
  WAVES,
  TOWER_TYPES,
} from '../constants/gameConfig';
import { WAYPOINTS, generateBuildableMap } from '../levels/level1';
import { createEnemy, updateEnemy } from '../entities/Enemy';
import { createTower, upgradeTower, getUpgradeCost, getSellValue } from '../entities/Tower';
import { createProjectile, updateProjectile } from '../entities/Projectile';
import { distance } from '../utils/math';
import audio from '../audio/AudioManager';

class GameEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = 'menu'; // menu | playing | paused | gameover | victory
    this.gold = START_GOLD;
    this.lives = START_LIVES;
    this.waveIndex = -1;
    this.waveActive = false;
    this.enemiesToSpawn = 0;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.waypoints = WAYPOINTS;
    this.buildable = generateBuildableMap();
    this.selectedTile = null;
    this.speedMultiplier = 1;
    this.enemiesKilled = 0;
    this.totalWaves = WAVES.length;
    this.onStateChange = null;
    this.onTick = null;
  }

  startGame() {
    this.reset();
    this.state = 'playing';
    this.startNextWave();
    this._notifyState();
  }

  startNextWave() {
    this.waveIndex += 1;
    if (this.waveIndex >= WAVES.length) {
      this.state = 'victory';
      this._play('victory');
      this._notifyState();
      return;
    }

    const wave = WAVES[this.waveIndex];
    this.waveActive = true;
    this.enemiesToSpawn = wave.count;
    this.spawnQueue = [];
    for (let i = 0; i < wave.count; i++) {
      const type = wave.types[i % wave.types.length];
      this.spawnQueue.push({ type, delay: i * wave.interval });
    }
    this.spawnTimer = 0;
    this._play('wave_start');
    this._notifyState();
  }

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'playing';
    }
    this._notifyState();
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  tick(dt) {
    if (this.state !== 'playing') return;

    const sdt = dt * this.speedMultiplier;

    // Spawning
    this._updateSpawning(sdt);

    // Movement
    this._updateEnemies(sdt);

    // Towers targeting & shooting
    this._updateTowers(sdt);

    // Projectiles
    this._updateProjectiles(sdt);

    // Check wave complete
    if (this.waveActive && this.enemiesToSpawn <= 0 && this.enemies.every((e) => !e.active)) {
      this.waveActive = false;
      // Auto-start next wave after 2s
      setTimeout(() => {
        if (this.state === 'playing' && !this.waveActive) {
          this.startNextWave();
        }
      }, 2000);
    }

    // Check game over
    if (this.lives <= 0) {
      this.state = 'gameover';
      this._play('game_over');
      this._notifyState();
    }

    if (this.onTick) this.onTick();
  }

  _play(name) {
    audio.play(name).catch(() => {});
  }

  _updateSpawning(dt) {
    if (this.enemiesToSpawn <= 0) return;
    this.spawnTimer += dt;

    while (this.spawnQueue.length > 0 && this.spawnTimer >= this.spawnQueue[0].delay) {
      const next = this.spawnQueue.shift();
      this.enemies.push(createEnemy(next.type, this.waypoints, TILE_SIZE));
      this.enemiesToSpawn--;
    }
  }

  _updateEnemies(dt) {
    for (const enemy of this.enemies) {
      const result = updateEnemy(enemy, this.waypoints, TILE_SIZE, dt);
      if (result === 'reached_base') {
        this.lives -= 1;
        this._play('life_loss');
        this._notifyState();
      }
    }
  }

  _updateTowers(dt) {
    for (const tower of this.towers) {
      tower.cooldownRemaining -= dt;
      if (tower.cooldownRemaining <= 0) {
        const target = this._findTarget(tower);
        if (target) {
          tower.targetId = target.id;
          const dx = target.x - tower.x;
          const dy = target.y - tower.y;
          tower.angle = Math.atan2(dy, dx);
          this.projectiles.push(createProjectile(tower, target, tower.type));
          this._play('shoot');
          tower.cooldownRemaining = tower.cooldown;
        }
      }
    }
  }

  _findTarget(tower) {
    let best = null;
    let bestProgress = -1;
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      const dist = distance(tower, enemy);
      if (dist <= tower.range && enemy.pathProgress > bestProgress) {
        bestProgress = enemy.pathProgress;
        best = enemy;
      }
    }
    return best;
  }

  _updateProjectiles(dt) {
    for (const proj of this.projectiles) {
      const target = this.enemies.find((e) => e.id === proj.targetId);
      const result = updateProjectile(proj, target, dt);
      if (result && result.hit) {
        this._applyDamage(result);
      }
    }
  }

  _applyDamage(result) {
    const { damage, splashRadius, effect, x, y } = result;
    const affected = [];

    if (splashRadius > 0) {
      for (const enemy of this.enemies) {
        if (!enemy.active) continue;
        if (distance({ x, y }, enemy) <= splashRadius + enemy.radius * TILE_SIZE) {
          affected.push(enemy);
        }
      }
    } else {
      const primary = this.enemies.find((e) => e.id === result.targetId);
      if (primary && primary.active) affected.push(primary);
    }

    if (affected.length > 0) {
      this._play('hit');
    }

    for (const enemy of affected) {
      enemy.hp -= damage;
      if (effect) {
        enemy.effects[effect.type] = {
          factor: effect.factor,
          remaining: effect.duration,
        };
      }
      if (enemy.hp <= 0 && enemy.active) {
        enemy.active = false;
        this._play('enemy_die');
        this.gold += enemy.reward;
        this.enemiesKilled += 1;
        this._notifyState();
      }
    }
  }

  // Building
  canBuild(tileX, tileY) {
    if (tileX < 0 || tileX >= GRID_COLS || tileY < 0 || tileY >= GRID_ROWS) return false;
    return this.buildable[tileY][tileX] && !this.towers.some((t) => t.tileX === tileX && t.tileY === tileY);
  }

  buildTower(type, tileX, tileY) {
    const cost = this.getTowerCost(type);
    if (this.gold < cost || !this.canBuild(tileX, tileY)) return false;
    this.gold -= cost;
    this.towers.push(createTower(type, tileX, tileY));
    this._play('build');
    this._notifyState();
    return true;
  }

  upgradeTowerAt(tileX, tileY) {
    const tower = this.towers.find((t) => t.tileX === tileX && t.tileY === tileY);
    if (!tower || tower.level >= 3) return false;
    const cost = getUpgradeCost(tower);
    if (this.gold < cost) return false;
    this.gold -= cost;
    upgradeTower(tower);
    this._notifyState();
    return true;
  }

  sellTowerAt(tileX, tileY) {
    const idx = this.towers.findIndex((t) => t.tileX === tileX && t.tileY === tileY);
    if (idx === -1) return false;
    const tower = this.towers[idx];
    this.gold += getSellValue(tower);
    this.towers.splice(idx, 1);
    this._notifyState();
    return true;
  }

  getTowerAt(tileX, tileY) {
    return this.towers.find((t) => t.tileX === tileX && t.tileY === tileY) || null;
  }

  getTowerCost(type) {
    return TOWER_TYPES[type].cost;
  }

  selectTile(tileX, tileY) {
    if (tileX >= 0 && tileX < GRID_COLS && tileY >= 0 && tileY < GRID_ROWS) {
      this.selectedTile = { x: tileX, y: tileY };
    } else {
      this.selectedTile = null;
    }
    this._notifyState();
  }

  deselectTile() {
    this.selectedTile = null;
    this._notifyState();
  }

  _notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        state: this.state,
        gold: this.gold,
        lives: this.lives,
        wave: this.waveIndex + 1,
        maxWave: this.totalWaves,
        waveActive: this.waveActive,
        enemiesKilled: this.enemiesKilled,
        selectedTile: this.selectedTile,
        towerAtTile: this.selectedTile ? this.getTowerAt(this.selectedTile.x, this.selectedTile.y) : null,
        isPaused: this.state === 'paused',
        speed: this.speedMultiplier,
      });
    }
  }

  getStateSnapshot() {
    return {
      state: this.state,
      gold: this.gold,
      lives: this.lives,
      wave: this.waveIndex + 1,
      maxWave: this.totalWaves,
      waveActive: this.waveActive,
      enemiesKilled: this.enemiesKilled,
      selectedTile: this.selectedTile,
      towerAtTile: this.selectedTile ? this.getTowerAt(this.selectedTile.x, this.selectedTile.y) : null,
      isPaused: this.state === 'paused',
      speed: this.speedMultiplier,
    };
  }

  stop() {
    this.loop.stop();
    this.state = 'menu';
    this.selectedTile = null;
  }
}

export default new GameEngine();
