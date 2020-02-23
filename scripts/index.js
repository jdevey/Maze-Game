'use strict';

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
      let s = `${seconds} seconds, ${score} points`;
      let scores = JSON.parse(localStorage.getItem('scores'));
      let elemId = 'scores' + size;
      let sizeScores = scores[elemId];
      sizeScores.push(s);
      localStorage.setItem('scores', JSON.stringify(scores));
      setScoresForSize(document.getElementById(elemId), size);
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

function initStorage() {
  localStorage.setItem(
    'scores',
    JSON.stringify({
      scores5: [],
      scores10: [],
      scores15: [],
      scores20: []
    })
  );
}

function clearElemChildren(elem) {
  let lastChild = elem.lastElementChild;
  while (lastChild) {
    elem.removeChild(lastChild);
    lastChild = elem.lastElementChild;
  }
}

function setScoresForSize(elem, size) {
  clearElemChildren(elem);
  let scores = JSON.parse(localStorage.getItem('scores'));
  let key = 'scores' + size;
  let scoresArr = scores[key];
  scoresArr.sort((a, b) => {
    let s1a = a.indexOf(' ');
    let s2a = a.indexOf(' ', s1a + 1);
    let s3a = a.indexOf(' ', s2a + 1);
    let s1b = b.indexOf(' ');
    let s2b = b.indexOf(' ', s1b + 1);
    let s3b = b.indexOf(' ', s2b + 1);
    let an1 = parseInt(a.substr(0, s1a));
    let an2 = parseInt(a.substr(s2a, s3a));
    let bn1 = parseInt(b.substr(0, s1b));
    let bn2 = parseInt(b.substr(s2b, s3b));
    if (an1 == bn1) {
      return bn2 - an2;
    }
    return an1 - bn1;
  });
  for (let i = 1; i <= 5; ++i) {
    let h4 = document.createElement('h4');
    h4.innerHTML = i + '. ' + (i > scoresArr.length ? '' : scoresArr[i - 1]);
    elem.appendChild(h4);
  }
}

function setUpScores() {
  if (localStorage.getItem('scores') === null) {
    initStorage();
  }
  let dropArea = document.getElementById('score-drop-area');
  let scores = JSON.parse(localStorage.getItem('scores'));
  for (let sizeKey in scores) {
    let size = parseInt(sizeKey.substring(6)); // position 6 to end of string
    let sizeElem = document.createElement('div');
    sizeElem.classList.add('size-score-area');
    dropArea.appendChild(sizeElem);
    let sizeLabel = document.createElement('h3');
    sizeLabel.innerHTML = `${size} x ${size} High Scores:`;
    sizeElem.appendChild(sizeLabel);
    let sizeIndiv = document.createElement('div');
    sizeIndiv.id = 'scores' + size;
    sizeElem.appendChild(sizeIndiv);
    setScoresForSize(sizeIndiv, size);
  }
}

function main() {
  setUpScores();
  setUpSizing();
  addNewGameEventListeners();
  startNewGame(DEFAULT_SIZE);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

window.onerror = function(message) {
  console.log(message);
};
