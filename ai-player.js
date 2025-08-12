let engine = null;

function initEngine() {
  if (engine) engine.terminate();
  engine = new Worker('lib/stockfish.wasm.js');
  engine.postMessage('uci');
}

function makeAiMove() {
  if (!isAiGame || game.game_over()) return;

  initEngine();

  // Difficulty mapping
  const skillLevels = {
    beginner: 500,
    advanced: 1800,
    expert: 2800
  };

  const skill = skillLevels[aiLevel] || 1800;
  const depth = aiLevel === 'beginner' ? 2 : aiLevel === 'advanced' ? 8 : 15;

  engine.postMessage('isready');
  engine.postMessage(`position fen ${game.fen()}`);
  engine.postMessage(`go depth ${depth}`);

  engine.onmessage = function(event) {
    const message = event.data;
    if (message.startsWith('bestmove')) {
      const bestMove = message.split(' ')[1];
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove[4] || undefined
        });
        board.position(game.fen());
        updateStatus();
      }
      engine.terminate();
    }
  };
}
