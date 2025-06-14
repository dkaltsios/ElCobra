/**
 * @module huntSmallerSnakes
 * @description This module implements logic to hunt smaller snakes on the board. If the Battlesnake is adjacent to a smaller snake's head, it will move in a direction that puts it adjacent to the smaller snake's head.
 * @exports huntSmallerSnakes
 */

/**
 * @function huntSmallerSnakes
 * @description This function checks for collisions with smaller snakes on the board and returns safe moves for your Battlesnake. The Battlesnake will move in a direction that puts it adjacent to a smaller snake's head.
 * @param {object} gameState - the current state of the game
 * @param {object} isMoveSafe - map of move => boolean
 * @returns {object} isMoveSafe - updated list of safe moves
 */
export function huntSmallerSnakes(gameState, isMoveSafe) {
  const myHead = gameState.you.body[0]
  const myLength = gameState.you.body.length
  const myId = gameState.you.id
  const directions = {
    up: { x: myHead.x, y: myHead.y + 1 },
    down: { x: myHead.x, y: myHead.y - 1 },
    left: { x: myHead.x - 1, y: myHead.y },
    right: { x: myHead.x + 1, y: myHead.y },
  }

  // Find all smaller snakes' heads
  const smallerHeads = gameState.board.snakes
    .filter((s) => s.id !== myId && s.body.length < myLength)
    .map((s) => s.body[0])

  // Mark moves that would put us adjacent to a smaller snake's head
  const huntMoves = {}
  for (const [move, pos] of Object.entries(directions)) {
    if (!isMoveSafe[move]) continue
    for (const head of smallerHeads) {
      if (pos.x === head.x && pos.y === head.y) {
        huntMoves[move] = true
      }
    }
  }
  return huntMoves
}
