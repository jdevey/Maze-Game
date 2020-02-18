function swap(a, b) {
  [a, b] = [b, a];
}

function getRep(reps, x) {
  while (x != reps[x]) {
    x = reps[x];
  }
  return x;
}

function same(reps, a, b) {
  return getRep(reps, a) == getRep(reps, b);
}

function join(sizes, reps, a, b) {
  a = getRep(reps, a);
  b = getRep(reps, b);
  if (sizes[b] > sizes[a]) {
    swap(a, b);
  }
  reps[b] = a;
  sizes[a] += sizes[b];
}

function makeRandomEdge(from, to) {
  return {
    from: from,
    to: to,
    weight: Math.random()
  };
}

function fillGraph(n, adj) {
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
      if (i > 0) {
        adj.push(makeRandomEdge(i * n + j, (i - 1) * n + j));
      }
      if (j > 0) {
        adj.push(makeRandomEdge(i * n + j, i * n + j - 1));
      }
    }
  }
}

// Return an adjacency matrix denoting whether each pair of adjacent cells are divided by an edge
// Given n rows and m columns, the cell with coordinates (i, j) has id i * n + j
function generateRandomMaze(n) {
  let total = n * n;
  let adj = [];
  fillGraph(n, adj);

  adj.sort((a, b) => a.weight - b.weight);

  sizes = new Array(total).fill(1);
  reps = [];
  for (let i = 0; i < total; ++i) {
    reps.push(i);
  }

  edges = new CustomSet();

  for (let i = 0; i < adj.length; ++i) {
    if (!same(reps, adj[i].to, adj[i].from)) {
      join(sizes, reps, adj[i].to, adj[i].from);
      edges.add(new Edge(adj[i].to, adj[i].from));
    }
  }

  return edges;
}

// Must try two possibilities since edges are bi-directional
function edgeExists(edges, edge) {
  return edges.has(edge) || edges.has(new Edge(edge.from, edge.to));
}
