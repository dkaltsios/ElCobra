// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
//
// A BattleSnake JavaScript starter project by CCS2100 Group 1 - ElCobra team
//

/**
 * @file Battlesnake JavaScript main file. Contains all the logic for your Battlesnake.
 * @requires server
 * @requires chalk
 * @requires preventSelfCollision
 * @requires avoidWalls
 * @requires avoidCollisionWithOtherSnakes
 * @requires avoidHeadToHead
 * @requires moveTowardClosestFood
 * @requires evaluateGameState
 * @requires floodFill
 * @requires simulateMove
 */

import runServer from './server.js'
import chalk from 'chalk'

// Collisions
import { preventSelfCollision } from './snake/collisions/preventSelfCollision.js'
import { avoidWalls } from './snake/collisions/avoidWalls.js'
import { avoidCollisionsWithOtherSnakes } from './snake/collisions/avoidCollisionWithOtherSnakes.js'
import { avoidHeadToHead } from './snake/collisions/avoidHeadToHead.js'

// Movement
import { moveTowardClosestFood } from './snake/movement/moveTowardsClosestFood.js'
import { evaluateGameState } from './snake/movement/evaluateGameState.js'
import { filterDeadEndMoves } from './snake/movement/floodFill.js'
import { simulateMove } from './snake/movement/simulateMove.js'

/**
 * @function info
 * @description Returns object with information about your Battlesnake. This function is called when you create your Battlesnake on play.battlesnake.com and controls your Battlesnake's appearance.
 * @returns {{ apiversion: string; author: string; color: string; head: string; tail: string; }}
 */

function info() {
  console.log('INFO')

  return {
    apiversion: '1',
    author: 'ElCobra', // Your Battlesnake Username
    color: '#C209E0', // Choose color
    head: 'silly', //  Choose head
    tail: 'round-bum', //  Choose tail
  }
}

/**
 * @function start
 * @description This function is called whenever your Battlesnake is entered into a game.
 */
function start() {
  console.log('GAME START')
}

/**
 * @function end
 * @description This function is called whenever your Battlesnake finishes a game.
 */
function end() {
  console.log('GAME OVER\n')
}

/**
 * @function move
 * @description This function is called on every turn and returns next move of your Battlesnake.
 * @param {object} gameState
 * @returns {move: string} - Valid moves are "up", "down", "left", or "right".
 */
// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  }

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0]
  const myNeck = gameState.you.body[1]

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false
  }

  //  Prevent your Battlesnake from moving out of bounds
  isMoveSafe = avoidWalls(gameState, isMoveSafe)

  //  Ensuring that battlesnake does not collide with itself
  isMoveSafe = preventSelfCollision(gameState, isMoveSafe)

  //  Prevent your Battlesnake from colliding with other Battlesnakes
  isMoveSafe = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)

  // Prevent your Battlesnake from colliding with other Battlesnakes' heads
  // Avoid head-to-head collisions
  isMoveSafe = avoidHeadToHead(gameState, isMoveSafe)

  //  Move towards food instead of random
  isMoveSafe = moveTowardClosestFood(gameState, isMoveSafe)

  //  Filter out dead-end moves
  isMoveSafe = filterDeadEndMoves(gameState, isMoveSafe)

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key])
  if (safeMoves.length === 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`)
    return { move: 'down' }
  }

  // Simulate each safe move and evaluate the resulting game state
  let bestMove = safeMoves[0] // Default to the first safe move
  let bestScore = -Infinity

  for (const move of safeMoves) {
    const simulatedGameState = simulateMove(gameState, move)
    const score = evaluateGameState(simulatedGameState)

    // Log the game state
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  console.log(`MOVE ${gameState.turn}: ${bestMove} (score: ${bestScore})`)
  printBoard(gameState.board) // Print the board for debugging
  return { move: bestMove }
}

/**
 * @function printBoard
 * @description Function to print the board in the terminal
 * @param {object} g
 */
function printBoard(g) {
  const board = g
  const printBoard = Array.from({ length: board.height }, () =>
    Array.from({ length: board.width }).fill('.')
  )
  for (const food of board.food) {
    printBoard[food.y][food.x] = chalk.red('F')
  }
  for (const snake of board.snakes) {
    for (const segment of snake.body) {
      printBoard[segment.y][segment.x] = chalk.green('S')
    }
  }
  for (let row = board.height - 1; row >= 0; row--) {
    console.log(printBoard[row].join(' '))
  }
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
})
