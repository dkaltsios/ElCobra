/**
 * Compute the size of the reachable area from a given start position
 * using flood-fill on the Battlesnake board.
 * @param {object} board - gameState.board object (width, height, snakes, hazards)
 * @param {{x:number,y:number}} start - Starting coordinates (e.g., after a potential move)
 * @returns {number} - Number of reachable cells (0 if start is blocked)
 */
export function floodFillBoard(board, start) {
  const { width, height, snakes, hazards = [] } = board
  const blocked = new Set()
  for (const snake of snakes)
    for (const { x, y } of snake.body) blocked.add(`${x},${y}`)

  for (const { x, y } of hazards) blocked.add(`${x},${y}`)

  const visited = new Set()
  const stack = [`${start.x},${start.y}`]
  let count = 0

  while (stack.length > 0) {
    const pos = stack.pop()
    if (visited.has(pos)) continue
    const [x, y] = pos.split(',').map(Number)
    if (x < 0 || x >= width || y < 0 || y >= height || blocked.has(pos))
      continue
    visited.add(pos)
    count++
    // Explore neighbors
    stack.push(
      `${x},${y + 1}`,
      `${x + 1},${y}`,
      `${x},${y - 1}`,
      `${x - 1},${y}`
    )
  }

  return count
}

/**
 * Mutates isMoveSafe, marking moves that lead into dead-ends (area ≤ 1) as unsafe.
 * @param {object} gameState - Full Battlesnake API payload
 * @param {object} isMoveSafe - map of move => boolean
 * @returns {object} isMoveSafe - updated map with dead-end moves removed
 */
export function filterDeadEndMoves(gameState, isMoveSafe) {
  const { board, you } = gameState
  const { x: hx, y: hy } = you.head
  const moves = {
    up: { x: hx, y: hy + 1 },
    right: { x: hx + 1, y: hy },
    down: { x: hx, y: hy - 1 },
    left: { x: hx - 1, y: hy },
  }

  for (const [move, coord] of Object.entries(moves)) {
    if (!isMoveSafe[move]) continue
    const area = floodFillBoard(board, coord)
    // treat area of 1 or 0 as dead-end
    if (area <= 1) {
      isMoveSafe[move] = false
    }
  }
  return isMoveSafe
}
