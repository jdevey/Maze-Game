class CustomSet {
  constructor() {
    this.set = new Set();
  }

  add(o) {
    this.set.add(JSON.stringify(o));
  }

  delete(o) {
    this.set.delete(JSON.stringify(o));
  }

  has(o) {
    return this.set.has(JSON.stringify(o));
  }
}

class Edge {
  constructor(to, from) {
    this.to = to;
    this.from = from;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(point) {
    return this.x == point.x && this.y == point.y;
  }
}

class GameState {
  constructor(edges, size) {
    // Constant or precomputed values
    this.edges = edges;
    this.size = size;
    this.finishPaths = computePathsToFinish();
    this.perfectPath = computePerfectPathSquares();
    this.oneOffPath = computeOneOffPathSquares();

    // State
    this.pos = new Point(0, 0);
    this.secondsElapsed = 0;
    this.score = 0;
    this.traveledSquares = new CustomSet();
    this.traveledSquares.add(new Point(0, 0));
  }

  travelToSquare(x, y) {
    this.travelToSquare(new Point(x, y));
  }

  travelToSquare(point) {
    if (!this.traveledSquares.has(point)) {
      this.score += this.getSquarePointValue(point);
      this.traveledSquares.add(point);
    }
    this.pos = point;
  }

  getHintSquare() {
    return this.finishPaths[this.pos.y][this.pos.x];
  }

  getPathToFinish() {
    let finishPath = [];
    let curr = new Point(this.pos.x, this.pos.y);
    let finish = new Point(-1, -1);
    while (!curr.equals(finish)) {
      finishPath.add(curr);
      curr = finishPaths[curr.y][curr.x];
    }
    return finishPath;
  }

  // Return a 2D array in which each square contains the point that should be
  // traveled to next to reach the ending in as few moves as possible
  computePathsToFinish() {
    let paths = [];
    let size = this.size;
    for (let i = 0; i < size; ++i) {
      paths.push(new Array(size).fill(new Point(-1, -1)));
    }
    paths[size - 1][size - 1].x = 0;
    paths[size - 1][size - 1].y = 0;
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
        if (isValidCoord(size, p) && !vis.has(p)) {
          q.push(p);
          vis.add(p);
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
      curr = finishPaths[curr.y][curr.x];
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
        if (this.perfectSquares.has(base)) {
          continue;
        }
        for (let k = 0; k < size; ++k) {
          let direc = direcs[k];
          let newX = i + direc.x;
          let newY = j + direc.y;
          let p = new Point(newX, newY);
          if (isValidCoord(size, p) && this.perfectSquares.has(p)) {
            oneOffSquares.add(p);
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
    }
    else if (this.oneOffPath.has(point)) {
      return ONE_OFF_SQUARE_VALUE;
    }
    else {
      return BAD_SQUARE_VALUE;
    }
  }
}
