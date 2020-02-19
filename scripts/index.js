var shouldStartNewGame = false;

function startOver() {
  shouldStartNewGame = true;
}

function update(gameState, timeStamp) {
  gameState.currentTime = timeStamp;
  // TODO handle end of game
}

let gameInput = (function() {
  function Keyboard() {
    let that = {
      keys: new Set()
    }
    function keyDown(e) {
      that.keys.add(e.keyCode);
    }
    function keyUp(e) {
      that.keys.delete(e.keyCode);
    }
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return that;
  }

  return {Keyboard: Keyboard};
}());

function startNewGame() {
  // TODO show old scores

  size = parseInt(document.querySelector('input[name="size"]:checked').value);
  let edges = generateRandomMaze(size);
  let gameState = new GameState(edges, size);

  // Return false so that page does not re-render
  let endGame = () => false & gameState.endGame();

  document.getElementById('size-form').addEventListener('submit', endGame);

  let input = gameInput.Keyboard();

  gameLoop(performance.now());

  function gameLoop(timeStamp) {
    handleInput(gameState, input);
    update(gameState, timeStamp);
    render(gameState);
    if (gameState.gameOver) { // TODO win detection
      requestAnimationFrame(gameLoop);
    }
  }

  // Clean up event listeners
  document.getElementById('size-form').removeEventListener('submit', endGame);
  //input.removeEventListeners();

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
  // while (true) {
    startNewGame();
  // }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
