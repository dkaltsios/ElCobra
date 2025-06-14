/**
 * @module avoidCollisionWithOtherSnakes
 * @description This module implements logic to avoid collisions with other snakes on the board.
 * @exports avoidCollisionsWithOtherSnakes
 */

/**
 * @function avoidCollisionsWithOtherSnakes
 * @description This function checks for collisions with other snakes and returns safe moves for your Battlesnake.
 * @param {object} gameState - the current state of the game
 * @param {object} isMoveSafe - map of move => boolean
 * @returns {object} isMoveSafe - updated list of safe moves with dead-end moves removed
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function avoidCollisionsWithOtherSnakes(gameState, isMoveSafe) {
  const myHead = gameState.you.body[0]
  const otherSnakes = gameState.board.snakes
  const foodPositions = new Set(
    gameState.board.food.map((f) => `${f.x},${f.y}`)
  )

  for (const snake of otherSnakes) {
    const snakeHead = snake.body[0]
    const snakeNeck = snake.body[1]

    // Direction vector of snake's movement
    const dx = snakeHead.x - snakeNeck.x
    const dy = snakeHead.y - snakeNeck.y
    const nextHead = { x: snakeHead.x + dx, y: snakeHead.y + dy }

    // Check if next head position is on food
    const willEatFood = foodPositions.has(`${nextHead.x},${nextHead.y}`)

    // Tail segment is the last part of the snake's body
    const tail = snake.body.at(-1)

    for (const segment of snake.body) {
      // If this segment is the tail and snake will NOT eat food next move,
      // then this tail square will be freed next move, so ignore it as obstacle.
      if (segment === tail && !willEatFood) {
        continue
      }

      if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
        isMoveSafe.right = false
      } else if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
        isMoveSafe.left = false
      } else if (segment.y === myHead.y + 1 && segment.x === myHead.x) {
        isMoveSafe.up = false
      } else if (segment.y === myHead.y - 1 && segment.x === myHead.x) {
        isMoveSafe.down = false
      }
    }
  }

  return isMoveSafe
}
