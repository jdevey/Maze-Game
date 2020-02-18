var shouldStartNewGame = false;

function startOver() {
  shouldStartNewGame = true;
}

function update(gameState, elapsedTime) {
  for (let i = gameEvents.length - 1; i > -1; --i) {
    let event = gameEvents[i];
    event.prevTime = event.currTime;
    event.currTime = elapsedTime;
    // Remove event
    if (event.lastLoop) {
      gameEvents.splice(i, 1);
    } else if (
      event.currTime - event.origTime >=
      event.interval * event.count
    ) {
      event.lastLoop = true;
    }
  }
}

function startNewGame() {
  // TODO show old scores

  size = parseInt(document.querySelector('input[name="size"]:checked').value);
  let edges = generateRandomMaze(size);
  let gameState = new GameState(edges, size);

  // Return false so that page does not re-render
  let endGame = () => false & gameState.endGame();

  document.getElementById('size-form').addEventListener('submit', endGame);

  input = new Input();

  gameLoop(performance.now());

  function gameLoop(elapsedTime) {
    handleInput(gameState);
    update(gameState, elapsedTime);
    render(gameState);
    if (!gameState.gameOver) { // TODO win detection
      requestAnimationFrame(gameLoop);
    }
  }

  // Clean up event listeners
  document.getElementById('size-form').removeEventListener('submit', endGame);
  input.removeEventListeners();

  // TODO persist score
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
  setUpSizing();
  while (true) {
    startNewGame();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
