function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function isOutOfBounds(pos, board) {
  return pos.x < 0 || pos.y < 0 || pos.x >= board.width || pos.y >= board.height;
}

function getNeighbors(pos, board, unsafe) {
  const deltas = [
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 0 }, { x: -1, y: 0 },
  ];

  return deltas
    .map(d => ({ x: pos.x + d.x, y: pos.y + d.y }))
    .filter(n => !isOutOfBounds(n, board))
    .filter(n => !unsafe.some(p => p.x === n.x && p.y === n.y));
}

function findPath(start, goal, board) {
  const unsafe = board.snakes.flatMap(s => s.body);
  const open = [start];
  const cameFrom = new Map();
  const g = new Map();
  const f = new Map();

  const key = (p) => `${p.x},${p.y}`;
  g.set(key(start), 0);
  f.set(key(start), manhattan(start, goal));

  while (open.length > 0) {
    open.sort((a, b) => f.get(key(a)) - f.get(key(b)));
    const current = open.shift();

    if (current.x === goal.x && current.y === goal.y) {
      const path = [];
      let node = current; // ✅ Fix: do not reassign `current`
      let currKey = key(node);
      while (cameFrom.has(currKey)) {
        path.unshift(node);
        node = cameFrom.get(currKey);
        currKey = key(node);
      }
      return path;
    }

    for (const neighbor of getNeighbors(current, board, unsafe)) {
      const nKey = key(neighbor);
      const tentative = g.get(key(current)) + 1;

      if (!g.has(nKey) || tentative < g.get(nKey)) {
        cameFrom.set(nKey, current);
        g.set(nKey, tentative);
        f.set(nKey, tentative + manhattan(neighbor, goal));
        if (!open.find(p => p.x === neighbor.x && p.y === neighbor.y)) {
          open.push(neighbor);
        }
      }
    }
  }

  return []; // No path
}

module.exports = { findPath };
