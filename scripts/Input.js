'use strict';

let gameInput = (function() {
  function Keyboard() {
    let that = {
      keys: new Set(),
      removeEventListeners: () => {
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
      }
    };
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

  return { Keyboard: Keyboard };
})();

function handleInput(gameState, input) {
  let keys = input.keys;
  let size = gameState.size;
  let x = gameState.pos.x;
  let y = gameState.pos.y;
  var newY = y,
    newX = x;
  // Go up
  if (keys.has(W_KEY) || keys.has(I_KEY) || keys.has(UP_KEY)) {
    newY = y - 1;
    newX = x;
  }
  // Go down
  if (keys.has(S_KEY) || keys.has(K_KEY) || keys.has(DOWN_KEY)) {
    newY = y + 1;
    newX = x;
  }
  // Go left
  if (keys.has(A_KEY) || keys.has(J_KEY) || keys.has(LEFT_KEY)) {
    newY = y;
    newX = x - 1;
  }
  // Go right
  if (keys.has(D_KEY) || keys.has(L_KEY) || keys.has(RIGHT_KEY)) {
    newY = y;
    newX = x + 1;
  }

  var p = new Point(newX, newY);
  var e = new Edge(y * size + x, newY * size + newX);
  if (isValidCoord(gameState.size, p) && edgeExists(gameState.edges, e)) {
    gameState.travelToSquare(p);
  }

  // Keys for toggling information
  if (keys.has(P_KEY)) {
    gameState.pathToggled = !gameState.pathToggled;
  }
  if (keys.has(B_KEY)) {
    gameState.breadcrumbsToggled = !gameState.breadcrumbsToggled;
  }
  if (keys.has(H_KEY)) {
    gameState.hintToggled = !gameState.hintToggled;
  }

  keys.clear();
}
