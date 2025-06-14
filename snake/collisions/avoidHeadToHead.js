/** @module avoidHeadToHead
 * @description This module implements logic to avoid collisions with other snakes on the board. It is additional to the `avoidCollisionsWithOtherSnakes` module. It checks for head-to-head collisions between your Battlesnake and other snakes on the board.
 * @exports avoidHeadToHead
 */

/**
 * @function avoidHeadToHead
 * @description This function checks for head-to-head collisions between your Battlesnake and other snakes on the board and returns safe moves for your Battlesnake.
 * @param {object} gameState - the current state of the game
 * @param {object} isMoveSafe - map of move => boolean
 * @returns {object} isMoveSafe - updated list of safe moves
 */
export function avoidHeadToHead(gameState, isMoveSafe) {
  const myHead = gameState.you.head
  const myLength = gameState.you.length
  const directions = {
    up: { x: myHead.x, y: myHead.y + 1 },
    down: { x: myHead.x, y: myHead.y - 1 },
    left: { x: myHead.x - 1, y: myHead.y },
    right: { x: myHead.x + 1, y: myHead.y },
  }

  for (const snake of gameState.board.snakes) {
    if (snake.id === gameState.you.id) continue // Skip self
    const theirHead = snake.head
    const theirLength = snake.length

    // All possible moves their head could make
    const theirMoves = [
      { x: theirHead.x, y: theirHead.y + 1 },
      { x: theirHead.x, y: theirHead.y - 1 },
      { x: theirHead.x - 1, y: theirHead.y },
      { x: theirHead.x + 1, y: theirHead.y },
    ]

    for (const [move, pos] of Object.entries(directions)) {
      if (
        isMoveSafe[move] &&
        theirMoves.some((m) => m.x === pos.x && m.y === pos.y) &&
        theirLength >= myLength // Only avoid if they are equal or longer
      ) {
        isMoveSafe[move] = false
      }
    }
  }
  return isMoveSafe
}
