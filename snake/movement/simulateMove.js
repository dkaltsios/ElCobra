/**
 * @module simulateMove
 * @description This module implements logic to simulate a move of your Battlesnake on the board.
 * @exports simulateMove
 */
/**
 * @function simulateMove
 * @description This function returns simulated state of the board after a move of your Battlesnake.
 * @param {object} gameState - the current state of the game
 * @param {string} move - the move of your Battlesnake
 * @returns {object} newGameState - the simulated state of the game
 */
export function simulateMove(gameState, move) {
  const newGameState = structuredClone(gameState) // Deep copy the game state
  const myHead = newGameState.you.body[0]

  // Update the head position based on the move
  switch (move) {
    case 'up': {
      myHead.y += 1
      break
    }
    case 'down': {
      myHead.y -= 1
      break
    }
    case 'left': {
      myHead.x -= 1
      break
    }
    case 'right': {
      myHead.x += 1
      break
    }
  }

  // Update the body to reflect the move
  newGameState.you.body.unshift({ ...myHead }) // Add new head position
  newGameState.you.body.pop() // Remove the tail

  // Decrease health
  newGameState.you.health -= 1

  // Check if food is eaten
  const foodIndex = newGameState.board.food.findIndex(
    (food) => food.x === myHead.x && food.y === myHead.y
  )
  if (foodIndex !== -1) {
    newGameState.you.body.push({ ...myHead }) // Grow the snake
    newGameState.you.health = 100 // Reset health
    newGameState.board.food.splice(foodIndex, 1) // Remove the eaten food
  }

  return newGameState
}
