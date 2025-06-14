/**
 * @module evaluateGameState
 * @description This module implements logic to evaluate the game state and return a score.
 * @exports evaluateGameState
 */

/**
 * @function evaluateGameState
 * @description This function evaluates the Battlesnake game state and returns a score.
 * @param {object} gameState - The current game state.
 * @returns {number} - The score of the Battlesnake based on the game state.
 */
// Function to evaluate the game state and return a score
export function evaluateGameState(gameState) {
  const myHead = gameState.you.head
  const myHealth = gameState.you.health
  const myLength = gameState.you.length
  const board = gameState.board

  // Heuristic factors
  let score = 0

  // 1. Prefer being closer to food if health is low
  if (myHealth < 50 && board.food.length > 0) {
    let closestFoodDistance = Infinity
    for (const food of board.food) {
      const distance = getDistanceFromTo(myHead.x, myHead.y, food.x, food.y)
      if (distance < closestFoodDistance) {
        closestFoodDistance = distance
      }
    }
    score -= closestFoodDistance * 2 // Closer food is better when low health
  }

  // 2. Longer snakes are better
  score += myLength * 10

  // 3. Staying alive is good
  score += myHealth

  return score
}

/**
 * @function getDistanceFromTo
 * @description This function calculates the distance between two points.
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} - The distance between the two points.
 */
function getDistanceFromTo(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}
