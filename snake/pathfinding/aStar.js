function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function isOutOfBounds(pos, board) {
  return pos.x < 0 || pos.y < 0 || pos.x >= board.width || pos.y >= board.height
}

function key(p) {
  return `${p.x},${p.y}`
}

function getNeighbors(pos, board, unsafe) {
  const deltas = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ]

  return deltas
    .map((d) => ({ x: pos.x + d.x, y: pos.y + d.y }))
    .filter((n) => !isOutOfBounds(n, board))
    .filter((n) => !unsafe.some((p) => p.x === n.x && p.y === n.y))
}

function reconstructPath(cameFrom, endNode) {
  const path = []
  let node = endNode
  let currKey = key(node)
  while (cameFrom.has(currKey)) {
    path.unshift(node)
    node = cameFrom.get(currKey)
    currKey = key(node)
  }
  return path
}

function shouldVisitNeighbor(g, current, neighbor) {
  const currentKey = key(current)
  const neighborKey = key(neighbor)
  const tentativeG = g.get(currentKey) + 1

  return !g.has(neighborKey) || tentativeG < g.get(neighborKey)
}

function findPath(start, goal, board) {
  const unsafe = board.snakes.flatMap((s) => s.body)
  const open = [start]
  const cameFrom = new Map()
  const g = new Map()
  const f = new Map()

  g.set(key(start), 0)
  f.set(key(start), manhattan(start, goal))

  while (open.length > 0) {
    open.sort((a, b) => f.get(key(a)) - f.get(key(b)))
    const current = open.shift()

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current)
    }

    for (const neighbor of getNeighbors(current, board, unsafe)) {
      if (shouldVisitNeighbor(g, current, neighbor)) {
        const currentKey = key(current)
        const neighborKey = key(neighbor)
        const tentativeG = g.get(currentKey) + 1

        cameFrom.set(neighborKey, current)
        g.set(neighborKey, tentativeG)
        f.set(neighborKey, tentativeG + manhattan(neighbor, goal))

        if (!open.some((p) => p.x === neighbor.x && p.y === neighbor.y)) {
          open.push(neighbor)
        }
      }
    }
  }

  return [] // No path
}

export { findPath }
