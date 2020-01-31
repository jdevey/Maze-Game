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

function fillGraph2(n, adj) {
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
      if (i > 0) {
        adj[i * n + j][(i - 1) * n + j] = true;
        adj[(i - 1) * n + j][i * n + j] = true;
      }
      if (j > 0) {
        adj[i * n + j][i * n + j - 1] = true;
        adj[i * n + j - 1][i * n + j] = true;
      }
    }
  }
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
        // adj.push(makeRandomEdge((i - 1) * n + j, i * n + j));
      }
      if (j > 0) {
        adj.push(makeRandomEdge(i * n + j, i * n + j - 1));
        // adj.push(makeRandomEdge(i * n + j - 1, i * n + j));
      }
    }
  }
}

// Return an adjacency matrix denoting whether each pair of adjacent cells are divided by an edge
function generateRandomMaze(n) {
  let total = n * n;
  let adj = [];
  fillGraph(n, adj);

  adj.sort((a, b) => a.weight - b.weight);

  sizes = new Array(total).fill(1);
  reps = []
  for (let i = 0; i < total; ++i) {
    reps.push(i);
  }

  edges = new Set();

  for (let i = 0; i < adj.length; ++i) {
    if (!same(reps, adj[i].to, adj[i].from)) {
      join(sizes, reps, adj[i].to, adj[i].from);
      edges.add(JSON.stringify({to: adj[i].to, from: adj[i].from}));
    }
  }

  return edges;
}

function edgeExists(edges, edge) {
  return edges.has(JSON.stringify(edge)) || edges.has(JSON.stringify({to: edge.from, from: edge.to}));
}

console.log(generateRandomMaze(3));

function render() {
  for (let i = 0; i < gameEvents.length; ++i) {
    let event = gameEvents[i];
    let multiple = Math.floor(
      (event.prevTime - event.origTime) / event.interval
    );
    for (
      let j = multiple + 1;
      j <= event.count && event.origTime + j * event.interval < event.currTime;
      ++j
    ) {
      let numToDisplay = event.count - j;
      let text = getTextRep(event.name, numToDisplay);
      appendEventToList(text);
      // Scroll whenever a new event is added
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}

function update(elapsedTime) {
  for (let i = gameEvents.length - 1; i > -1; --i) {
    let event = gameEvents[i];
    event.prevTime = event.currTime;
    event.currTime = elapsedTime;
    // Remove event
    if (event.lastLoop) {
      gameEvents.splice(i, 1);
    } else if (
      event.currTime - event.origTime >=
      event.interval * event.count
    ) {
      event.lastLoop = true;
    }
  }
}

function gameLoop(elapsedTime) {
  update(elapsedTime);
  render();
  requestAnimationFrame(gameLoop);
}

function main() {
  gameLoop(performance.now());
}

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', main);
// } else {
//   main();
// }
