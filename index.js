const direcs = [
  {x: 0, y: 1},
  {x: 1, y: 0},
  {x: 0, y: -1},
  {x: -1, y: 0}
]

//console.log(generateRandomMaze(3));

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
  console.log('Size: ' + size);
}

function renderMazeOutline(context, size, cellSize, edges) {
  context.save();
  context.strokeStyle = 'red';
  context.strokeWidth = 5;
  context.strokeRect(20, 20, 100, 100);
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      // for (let k = 0; k < 4; ++k) {
        if (i == 0 || edgeExists(edges, {to: i * size + j, from: (i - 1) + j})) {
          context.beginPath();
          context.moveTo(j * cellSize, i * cellSize);
          context.lineTo((j + 1) * cellSize, i * cellSize);
          context.stroke();
        }
      // }
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
  context.strokeRect(10, 10, 30, 30);
  context.strokeStyle = 'black';
  renderMazeOutline(context, defaultSize, cellSize, edges);
  //gameLoop(performance.now());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
