/**
 * @module avoidWalls
 * @description This module implements logic to avoid collisions with walls on the board.
 * @exports avoidWalls
 */
/**
 * @function avoidWalls
 * @description This function checks for collisions with walls on the board and returns safe moves for your Battlesnake.
 * @param {object} gameState - the current state of the game
 * @param {object} isMoveSafe - map of move => boolean
 * @returns {object} isMoveSafe - updated list of safe moves
 */
export function avoidWalls(gameState, isMoveSafe) {
  const boardWidth = gameState.board.width
  const boardHeight = gameState.board.height
  const myHead = gameState.you.body[0]

  if (myHead.x === 0) isMoveSafe.left = false // Left wall
  if (myHead.x === boardWidth - 1) isMoveSafe.right = false // Right wall
  if (myHead.y === 0) isMoveSafe.down = false // Bottom wall
  if (myHead.y === boardHeight - 1) isMoveSafe.up = false // Top wall

  return isMoveSafe
}
