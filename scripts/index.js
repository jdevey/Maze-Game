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

function startNewGame() {
  // TODO show old scores

  let size = parseInt(document.querySelector('input[name="size"]:checked').value);
  let edges = generateRandomMaze(size);
  let gameState = new GameState(edges, size);

  //let sizeForm = document.getElementById('size-form');
  //clearListeners(sizeForm);
  // let clickAction =  e => {
  //   // e.preventDefault();
  //   // endGame();
  //   startNewGame();
  //   return false;
  // };

  //sizeForm.addEventListener('submit', clickAction);
  //sizeForm.addEventListener('submit', event => event.preventDefault());
  document.getElementById('win-message').innerHTML = '';

  let input = gameInput.Keyboard();

  gameLoop(performance.now());

  function gameLoop(timeStamp) {
    handleInput(gameState, input);
    update(gameState, timeStamp);
    render(gameState);
    if (!gameState.gameOver) {
      requestAnimationFrame(gameLoop);
    } else {
      endGame();
    }
  }

  function endGame(event) {
    //event.preventDefault();
    // Clean up event listeners
    let sizeForm = document.getElementById('size-form');
    sizeForm.removeEventListener('submit', clickAction);
    input.removeEventListeners();

    // TODO persist score

    // Return false so that page does not re-render
    //sizeForm.addEventListener('submit', startNewGame);
    return false;
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
  setUpSizing();
  startNewGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
