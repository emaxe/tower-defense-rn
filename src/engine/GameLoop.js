class GameLoop {
  constructor(engine) {
    this.engine = engine;
    this.running = false;
    this.lastTimestamp = 0;
    this.rafId = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTimestamp = performance.now();
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _tick(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1); // cap at 100ms
    this.lastTimestamp = timestamp;
    this.engine.tick(dt);
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  }
}

export default GameLoop;
