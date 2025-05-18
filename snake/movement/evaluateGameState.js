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

function getDistanceFromTo(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}
