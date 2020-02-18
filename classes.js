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
