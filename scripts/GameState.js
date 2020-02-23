'use strict';

class GameState {
  constructor(edges, size) {
    // Constant or precomputed values
    this.edges = edges;
    this.size = size;
    this.finishPath = this.computePathsToFinish();
    this.perfectPath = this.computePerfectPathSquares();
    this.oneOffPath = this.computeOneOffPathSquares();
    this.images = this.createImageMap();

    // State
    this.pos = new Point(0, 0);
    this.startTime = performance.now();
    this.currentTime = this.gameStartTime;
    this.score = 0;
    this.traveledArray = [new Point(0, 0)];
    this.traveledSquares = new CustomSet();
    this.traveledSquares.add(new Point(0, 0));
    this.hintToggled = false;
    this.breadcrumbsToggled = false;
    this.pathToggled = false;
    this.gameOver = false;
    this.playerHasWon = false;
  }

  createImageMap() {
    let images = {};
    let imgNames = [HERO_IMG_NAME, ARROW_IMG_NAME, COIN_IMG_NAME];
    for (let i = 0; i < imgNames.length; ++i) {
      let img = new Image();
      img.src = imgNames[i];
      images[imgNames[i]] = img;
    }
    return images;
  }

  travelToSquare(x, y) {
    this.travelToSquare(new Point(x, y));
  }

  travelToSquare(point) {
    if (!this.traveledSquares.has(point)) {
      this.score += this.getSquarePointValue(point);
      this.traveledSquares.add(point);
      this.traveledArray.push(point);
    }
    this.pos = point;
  }

  getHintSquare() {
    return this.finishPath[this.pos.y][this.pos.x];
  }

  getPathToFinish() {
    let finishPath = [];
    let curr = new Point(this.pos.x, this.pos.y);
    let finish = new Point(-1, -1);
    while (!curr.equals(finish)) {
      finishPath.push(curr);
      curr = this.finishPath[curr.y][curr.x];
    }
    return finishPath;
  }

  // Return a 2D array in which each square contains the point that should be
  // traveled to next to reach the ending in as few moves as possible
  computePathsToFinish() {
    let paths = [];
    let size = this.size;
    for (let i = 0; i < size; ++i) {
      paths.push([]);
      for (let j = 0; j < size; ++j) {
        paths[i].push(new Point(-1, -1));
      }
    }
    paths[size - 1][size - 1].x = -1;
    paths[size - 1][size - 1].y = -1;
    let vis = new CustomSet();
    let begin = new Point(size - 1, size - 1);
    let q = [begin];
    while (q.length > 0) {
      let top = q.pop();
      if (vis.has(top)) {
        continue;
      }
      vis.add(top);
      for (let k = 0; k < 4; ++k) {
        let direc = direcs[k];
        let newX = top.x + direc.x;
        let newY = top.y + direc.y;
        let p = new Point(newX, newY);
        if (
          isValidCoord(size, p) &&
          edgeExists(
            this.edges,
            new Edge(top.y * size + top.x, newY * size + newX)
          ) &&
          !vis.has(p)
        ) {
          q.push(p);
          paths[newY][newX].x = top.x;
          paths[newY][newX].y = top.y;
        }
      }
    }
    return paths;
  }

  // Return the set of squares that are on the optimal path from start to finish
  computePerfectPathSquares() {
    let perfectSquares = new CustomSet();
    let curr = new Point(0, 0);
    let finish = new Point(-1, -1);
    while (!curr.equals(finish)) {
      perfectSquares.add(curr);
      curr = this.finishPath[curr.y][curr.x];
    }
    return perfectSquares;
  }

  // Return the set of squares that are one off from the optimal path from start to finish
  computeOneOffPathSquares() {
    let oneOffSquares = new CustomSet();
    let size = this.size;
    for (let i = 0; i < size; ++i) {
      for (let j = 0; j < size; ++j) {
        let base = new Point(j, i);
        if (this.perfectPath.has(base)) {
          continue;
        }
        for (let k = 0; k < 4; ++k) {
          let direc = direcs[k];
          let newX = i + direc.x;
          let newY = j + direc.y;
          let p = new Point(newX, newY);
          if (isValidCoord(size, p) && this.perfectPath.has(p)) {
            oneOffSquares.add(base);
          }
        }
      }
    }
    return oneOffSquares;
  }

  // Get the value associated with traveling to a new square
  getSquarePointValue(point) {
    if (this.perfectPath.has(point)) {
      return PERFECT_SQUARE_VALUE;
    } else if (this.oneOffPath.has(point)) {
      return ONE_OFF_SQUARE_VALUE;
    } else {
      return BAD_SQUARE_VALUE;
    }
  }

  getElapsedSeconds() {
    return Math.floor((this.currentTime - this.startTime) / 1000);
  }

  endGame() {
    this.gameOver = true;
  }
}
