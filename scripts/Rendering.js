'use strict';

function renderWinMessage(gameState) {
  let size = gameState.size;
  let seconds = gameState.getElapsedSeconds();
  let score = gameState.score;
  document.getElementById(
    'win-message'
  ).innerHTML = `Congratulations! You beat a ${size}x${size} maze in ${seconds} seconds with a score of ${score} points.`;
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
      if (
        i == 0 ||
        !edgeExists(edges, { to: i * size + j, from: (i - 1) * size + j })
      ) {
        drawMazeLine(context, cellSize, j, i, j + 1, i);
      }
      if (
        i == size - 1 ||
        !edgeExists(edges, { to: i * size + j, from: (i + 1) * size + j })
      ) {
        drawMazeLine(context, cellSize, j, i + 1, j + 1, i + 1);
      }
      if (
        j == 0 ||
        !edgeExists(edges, { to: i * size + j, from: i * size + j - 1 })
      ) {
        drawMazeLine(context, cellSize, j, i, j, i + 1);
      }
      if (
        j == size - 1 ||
        !edgeExists(edges, { to: i * size + j, from: i * size + j + 1 })
      ) {
        drawMazeLine(context, cellSize, j + 1, i, j + 1, i + 1);
      }
    }
  }
  context.restore();
}

function renderPlayer(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'blue';
  context.fillRect(
    x * cellSize + cellSize / 4,
    y * cellSize + cellSize / 4,
    cellSize / 2,
    cellSize / 2
  );
  context.restore();
}

function renderGoal(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'green';
  context.fillRect(
    x * cellSize + cellSize / 4,
    y * cellSize + cellSize / 4,
    cellSize / 2,
    cellSize / 2
  );
  context.restore();
}

function renderStart(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'red';
  context.fillRect(
    x * cellSize + cellSize / 4,
    y * cellSize + cellSize / 4,
    cellSize / 2,
    cellSize / 2
  );
  context.restore();
}

function renderBreadcrumb(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'white';
  context.fillRect(
    x * cellSize + (cellSize * 3) / 8,
    y * cellSize + (cellSize * 3) / 8,
    cellSize / 4,
    cellSize / 4
  );
  context.restore();
}

function renderHint(context, cellSize, x, y) {
  context.save();
  // let cx = x * cellSize + cellSize / 2;
  // let cy = y * cellSize + cellSize / 2;
  // let gradient = context.createRadialGradient(cx, cy, cellSize / 2, cx, cy, cellSize / 2);
  // gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  // gradient.addColorStop(1, 'rgba(0, 255, 0, 0.5)');
  // context.fillStyle = gradient;
  // context.beginPath();
  // context.ellipse(cx, cy, cellSize / 2, cellSize / 2, 0, 0, Math.PI * 2);
  // context.fill();
  context.fillStyle = 'orange';
  context.fillRect(
    x * cellSize + (cellSize * 3) / 8,
    y * cellSize + (cellSize * 3) / 8,
    cellSize / 4,
    cellSize / 4
  );
  context.restore();
}

function renderPath(context, cellSize, x, y) {
  context.save();
  context.fillStyle = 'yellow';
  context.fillRect(
    x * cellSize + (cellSize * 3) / 8,
    y * cellSize + (cellSize * 3) / 8,
    cellSize / 4,
    cellSize / 4
  );
  context.restore();
}

// TODO render hint, breadcrumbs, path

function render(gameState) {
  let canvas = document.getElementById('game-canvas');
  let context = canvas.getContext('2d');
  let canvasSize = canvas.width;
  let size = gameState.size;
  let cellSize = canvasSize / size;

  document.getElementById('score').innerHTML = gameState.score + ' points';
  document.getElementById('time').innerHTML =
    gameState.getElapsedSeconds() + ' seconds';

  context.clearRect(0, 0, canvasSize, canvasSize);
  renderMazeOutline(context, size, cellSize, gameState.edges);
  renderStart(context, cellSize, 0, 0);

  if (gameState.breadcrumbsToggled) {
    let crumbs = gameState.traveledArray;
    for (let i = 0; i < crumbs.length; ++i) {
      renderBreadcrumb(context, cellSize, crumbs[i].x, crumbs[i].y);
    }
  }

  if (gameState.pathToggled) {
    let path = gameState.getPathToFinish();
    for (let i = 0; i < path.length; ++i) {
      renderPath(context, cellSize, path[i].x, path[i].y);
    }
  }

  if (gameState.hintToggled) {
    let next = gameState.getHintSquare();
    renderHint(context, cellSize, next.x, next.y);
  }

  renderGoal(context, cellSize, size - 1, size - 1);
  renderPlayer(context, cellSize, gameState.pos.x, gameState.pos.y);

  if (gameState.gameOver && gameState.playerHasWon) {
    renderWinMessage(gameState);
  }
}
