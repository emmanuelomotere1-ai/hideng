// DOM Elements
const modeSelection = document.getElementById('mode-selection');
const aiDifficulty = document.getElementById('ai-difficulty');
const gameBoardContainer = document.getElementById('game-board-container');
const aiModeBtn = document.getElementById('ai-mode-btn');
const pvpModeBtn = document.getElementById('pvp-mode-btn');
const backToModes = document.getElementById('back-to-modes');
const resetGameBtn = document.getElementById('reset-game');
const quitGameBtn = document.getElementById('quit-game');

let board = null;
let game = new Chess();
let isAiGame = false;
let aiLevel = null;

// Initialize board
function initBoard() {
  const config = {
    draggable: true,
    dropOffBoard: 'snapback',
    onDrop: handleMove
  };
  board = Chessboard('chessboard', config);
}

// Handle player move
function handleMove(from, to) {
  const move = game.move({
    from,
    to,
    promotion: 'q' // auto-promote to queen
  });

  if (move === null) return 'snapback';

  board.position(game.fen());

  if (isAiGame && !game.game_over()) {
    setTimeout(makeAiMove, 600);
  }

  updateStatus();
}

// Update game status
function updateStatus() {
  let status = '';
  if (game.in_checkmate()) {
    status = `Game Over: ${game.turn() === 'w' ? 'Black' : 'White'} wins by checkmate!`;
  } else if (game.in_draw()) {
    status = 'Game Over: Draw';
  } else {
    status = `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  }
  document.getElementById('game-status').innerText = status;
}

// Show AI difficulty options
aiModeBtn.addEventListener('click', () => {
  modeSelection.classList.add('hidden');
  aiDifficulty.classList.remove('hidden');
});

// Back to mode selection
backToModes.addEventListener('click', () => {
  aiDifficulty.classList.add('hidden');
  modeSelection.classList.remove('hidden');
});

// AI Difficulty Selection
document.querySelectorAll('#ai-difficulty button[data-level]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    aiLevel = e.target.dataset.level;
    startGame(true, aiLevel);
  });
});

// PvP Mode
pvpModeBtn.addEventListener('click', () => {
  startGame(false);
});

// Start the game
function startGame(vsAi, level = null) {
  isAiGame = vsAi;
  aiLevel = level;
  modeSelection.classList.add('hidden');
  aiDifficulty.classList.add('hidden');
  gameBoardContainer.classList.remove('hidden');

  game = new Chess();
  initBoard();
  updateStatus();

  if (isAiGame && game.turn() === 'b') { // AI plays black and moves first if player is white
    setTimeout(makeAiMove, 600);
  }
}

// Reset game
resetGameBtn.addEventListener('click', () => {
  gameBoardContainer.classList.add('hidden');
  modeSelection.classList.remove('hidden');
  if (board) board.destroy();
});

// Quit game
quitGameBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to quit?")) {
    resetGameBtn.click();
  }
});

// On load
document.addEventListener('DOMContentLoaded', () => {
  initBoard(); // Initial board for demo
  updateStatus();
});
