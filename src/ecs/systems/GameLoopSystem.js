const GameLoopSystem = (entities, { time }) => {
  const gm = entities.gameManager;
  if (gm && gm.state === 'playing') {
    const dt = Math.min((time.delta || 16) / 1000, 0.1);
    gm.tick(dt * gm.speedMultiplier);
  }
  return entities;
};

export default GameLoopSystem;
