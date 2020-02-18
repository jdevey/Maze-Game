
function render() {
  for (let i = 0; i < gameEvents.length; ++i) {
    let event = gameEvents[i];
    let multiple = Math.floor(
      (event.prevTime - event.origTime) / event.interval
    );
    for (
      let j = multiple + 1;
      j <= event.count && event.origTime + j * event.interval < event.currTime;
      ++j
    ) {
      let numToDisplay = event.count - j;
      let text = getTextRep(event.name, numToDisplay);
      appendEventToList(text);
      // Scroll whenever a new event is added
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}

function update(elapsedTime) {
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

function gameLoop(elapsedTime) {
  update(elapsedTime);
  render();
  requestAnimationFrame(gameLoop);
}

function startNewGame() {
  size = parseInt(document.querySelector('input[name="size"]:checked').value);
}

function drawMazeLine(context, cellSize, x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1 * cellSize, y1 * cellSize);
  context.lineTo(x2 * cellSize, y2 * cellSize);
  context.stroke();
}

function renderMazeOutline(context, size, cellSize, edges) {
  context.save();
  context.strokeStyle = 'black';
  context.lineWidth = 4;
  context.lineCap = 'round';
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
        if (i == 0 || !edgeExists(edges, {to: i * size + j, from: (i - 1) * size + j})) {
          drawMazeLine(context, cellSize, j, i, j + 1, i);
        }
        if (i == size - 1 || !edgeExists(edges, {to: i * size + j, from: (i + 1) * size + j})) {
          drawMazeLine(context, cellSize, j, i + 1, j + 1, i + 1);
        }
        if (j == 0 || !edgeExists(edges, {to: i * size + j, from: i * size + j - 1})) {
          drawMazeLine(context, cellSize, j, i, j, i + 1);
        }
        if (j == size - 1 || !edgeExists(edges, {to: i * size + j, from: i * size + j + 1})) {
          drawMazeLine(context, cellSize, j + 1, i, j + 1, i + 1);
        }
    }
  }
  context.restore();
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
  let defaultSize = 10;
  let edges = generateRandomMaze(defaultSize);
  let canvas = document.getElementById('game-canvas');
  let context = canvas.getContext('2d');
  let size = defaultSize;
  let cellSize = canvas.width / size;
  renderMazeOutline(context, defaultSize, cellSize, edges);
  //gameLoop(performance.now());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
