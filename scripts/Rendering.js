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

function renderPlayer(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'blue';
  context.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
  context.restore();
}

function renderGoal(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'green';
  context.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
  context.restore();
}

// TODO render hint, breadcrumbs, path

function render(gameState) {
  let canvas = document.getElementById('game-canvas');
  let context = canvas.getContext('2d');
  let canvasSize = canvas.width;
  let size = gameState.size;
  let cellSize = canvasSize / size;

  context.clearRect(0, 0, canvasSize, canvasSize);
  renderMazeOutline(context, size, cellSize, gameState.edges);
  renderPlayer(context, cellSize, gameState.pos.x, gameState.pos.y);
  renderGoal(context, cellSize, size - 1, size - 1);
}
