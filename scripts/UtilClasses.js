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

const direcs = [
  new Point(0, 1),
  new Point(1, 0),
  new Point(0, -1),
  new Point(-1, 0)
];
