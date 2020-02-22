'use strict';

var shouldStartNewGame = false;

function startOver() {
  shouldStartNewGame = true;
}

function update(gameState, timeStamp) {
  gameState.currentTime = timeStamp;
  let size = gameState.size;
  if (gameState.pos.x == size - 1 && gameState.pos.y == size - 1) {
    gameState.endGame();
    gameState.playerHasWon = true;
  }
}

function clearSizeForm() {
  let node = document.getElementById('size-form');
  let copy = node.cloneNode(true);
  node.parentNode.replaceChild(copy, node);
}

function startNewGame(size) {
  let edges = generateRandomMaze(size);
  let gameState = new GameState(edges, size);
  document.getElementById('win-message').innerHTML = '';

  let input = gameInput.Keyboard();
  addCleanupListeners();
  gameLoop(performance.now());

  function gameLoop(timeStamp) {
    handleInput(gameState, input);
    update(gameState, timeStamp);
    render(gameState);
    if (!gameState.gameOver) {
      requestAnimationFrame(gameLoop);
    } else {
      if (gameState.playerHasWon) {
        recordGame();
      }
    }
  }

  function cleanup() {
    gameState.gameOver = true;
    let btns = document.getElementsByClassName('size-item');
    for (let i = 0; i < btns.length; ++i) {
      btns[i].removeEventListener('click', cleanup);
    }
    input.removeEventListeners();
  }

  function addCleanupListeners() {
    let btns = document.getElementsByClassName('size-item');
    for (let i = 0; i < btns.length; ++i) {
      btns[i].addEventListener('click', cleanup);
    }
  }

  function recordGame() {
    let size = gameState.size;
    let seconds = gameState.getElapsedSeconds();
    let score = gameState.score;
    cleanup();
    if (gameState.playerHasWon) {
      let s = `${size}x${size} maze, ${seconds} seconds, ${score} points`;
      let scores = JSON.parse(localStorage.getItem('scores'));
      scores.push(s);
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }
}

function addNewGameEventListeners() {
  let btns = document.getElementsByClassName('size-item');
  for (let i = 0; i < btns.length; ++i) {
    let btnSize = parseInt(btns[i].getAttribute('data-size'));
    btns[i].addEventListener('click', () => {
      startNewGame(btnSize);
    });
  }
}

function setUpSizing() {
  let { width, height } = document
    .getElementById('canvas-cont')
    .getBoundingClientRect();
  let canvasSize = Math.min(width, height) * 0.95;
  document.getElementById('game-canvas').width = canvasSize;
  document.getElementById('game-canvas').height = canvasSize;
}

function main() {
  if (localStorage.getItem('scores') === null) {
    localStorage.setItem('scores', JSON.stringify([]));
  }
  let items = JSON.parse(localStorage.getItem('scores'));
  for (let i = 0; i < items.length; ++i) {
    let h4 = document.createElement('h4');
    h4.innerHTML = items[i];
    document.getElementById('score-drop-area').appendChild(h4);
  }
  setUpSizing();
  addNewGameEventListeners();
  startNewGame(2);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
