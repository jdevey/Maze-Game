// class Input {
//   constructor() {
//     // Timestamps not needed
//     this.keys = new Set();
//     window.addEventListener('keydown', this.keyDown);
//     window.addEventListener('keyup', this.keyUp);
//   }

//   removeEventListeners() {
//     window.removeEventListener('keyup', this.keyUp);
//     window.removeEventListener('keydown', this.keyDown);
//   }

//   keyDown(e) {
//     this.keys.add(e.keyCode);
//   }

//   keyUp(e) {
//     this.keys.delete(e.keyCode);
//   }

//   isKeyPressed(c) {
//     return this.keys.has(c);
//   }
// }

function handleInput(gameState, input) {
  let keys = input.keys;
  let size = gameState.size;
  let x = gameState.pos.x;
  let y = gameState.pos.y;
  // Go up
  if (keys.has(W_KEY) || keys.has(I_KEY) || keys.has(UP_KEY)) {
    let newY = y - 1;
    let newX = x;
    let p = new Point(newX, newY);
    let e = new Edge(y * size + x, newY * size + newX);
    if (isValidCoord(gameState.size, p) && edgeExists(gameState.edges, e)) {
      --gameState.pos.y;
    }
  }
  // Go down
  if (keys.has(S_KEY) || keys.has(K_KEY) || keys.has(DOWN_KEY)) {
    let newY = y + 1;
    let newX = x;
    let p = new Point(newX, newY);
    let e = new Edge(y * size + x, newY * size + newX);
    if (isValidCoord(gameState.size, p) && edgeExists(gameState.edges, e)) {
      --gameState.pos.y;
    }
  }
}