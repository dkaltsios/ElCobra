/**
 * @file Test file for testing snake behavior on different map sizes
 * Tests small (7x7), medium (11x11), and large (19x19, 25x25) battlesnake maps
 */

import { preventSelfCollision } from '../../snake/collisions/preventSelfCollision.js'
import { avoidWalls } from '../../snake/collisions/avoidWalls.js'
import { avoidCollisionsWithOtherSnakes } from '../../snake/collisions/avoidCollisionWithOtherSnakes.js'
import { avoidHeadToHead } from '../../snake/collisions/avoidHeadToHead.js'
import { moveTowardClosestFood } from '../../snake/movement/moveTowardsClosestFood.js'
import { evaluateGameState } from '../../snake/movement/evaluateGameState.js'
import { filterDeadEndMoves } from '../../snake/movement/floodFill.js'
import { simulateMove } from '../../snake/movement/simulateMove.js'

/**
 * Helper function to create a game state for testing
 * @param {number} width - Board width
 * @param {number} height - Board height
 * @param {object} snakePosition - Snake head position {x, y}
 * @param {number} snakeLength - Length of the snake
 * @param {Array} food - Array of food positions
 * @param {Array} otherSnakes - Array of other snakes
 * @returns {object} Game state object
 */
function createGameState(
  width,
  height,
  snakePosition,
  snakeLength = 3,
  food = [],
  otherSnakes = []
) {
  const snakeBody = []

  // Create snake body extending downward from head
  for (let i = 0; i < snakeLength; i++) {
    snakeBody.push({
      x: snakePosition.x,
      y: Math.max(0, snakePosition.y - i),
    })
  }

  return {
    game: {
      id: 'test-game',
      ruleset: { name: 'standard' },
      timeout: 500,
    },
    turn: 1,
    board: {
      width,
      height,
      food,
      snakes: [
        {
          id: 'my-snake',
          name: 'Test Snake',
          health: 90,
          body: snakeBody,
          head: snakeBody[0],
          length: snakeLength,
          latency: '50ms',
          shout: '',
        },
        ...otherSnakes,
      ],
      hazards: [],
    },
    you: {
      id: 'my-snake',
      name: 'Test Snake',
      health: 90,
      body: snakeBody,
      head: snakeBody[0],
      length: snakeLength,
      latency: '50ms',
      shout: '',
    },
  }
}

/**
 * Helper function to simulate the main move logic
 * @param {object} gameState - The game state
 * @returns {object} The chosen move and safe moves
 */
function simulateMainMoveLogic(gameState) {
  let isMoveSafe = { up: true, down: true, left: true, right: true }

  // Apply neck collision avoidance (from main logic)
  const myHead = gameState.you.head
  const myNeck = gameState.you.body[1]

  if (myNeck) {
    if (myNeck.x < myHead.x) {
      isMoveSafe.left = false
    } else if (myNeck.x > myHead.x) {
      isMoveSafe.right = false
    } else if (myNeck.y < myHead.y) {
      isMoveSafe.down = false
    } else if (myNeck.y > myHead.y) {
      isMoveSafe.up = false
    }
  }

  // Apply all collision detection
  isMoveSafe = avoidWalls(gameState, isMoveSafe)
  isMoveSafe = preventSelfCollision(gameState, isMoveSafe)
  isMoveSafe = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)
  isMoveSafe = avoidHeadToHead(gameState, isMoveSafe)
  isMoveSafe = moveTowardClosestFood(gameState, isMoveSafe)
  isMoveSafe = filterDeadEndMoves(gameState, isMoveSafe)

  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key])

  if (safeMoves.length === 0) {
    return { move: 'down', safeMoves: [], allMoves: isMoveSafe }
  }

  // Find best move using evaluation
  let bestMove = safeMoves[0]
  let bestScore = -Infinity

  for (const move of safeMoves) {
    const simulatedGameState = simulateMove(gameState, move)
    const score = evaluateGameState(simulatedGameState)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return { move: bestMove, safeMoves, allMoves: isMoveSafe, bestScore }
}

describe('Map Size Tests', () => {
  describe('Small Map (7x7)', () => {
    const mapSize = { width: 7, height: 7 }

    it('should handle movement in small confined space', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 3, y: 3 }, // Center position
        3,
        [{ x: 1, y: 1 }] // Food in corner
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(['up', 'down', 'left', 'right']).toContain(result.move)
    })

    it('should avoid walls when near edges on small map', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 0, y: 3 }, // Left edge
        3,
        [{ x: 5, y: 5 }] // Add food
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.allMoves.left).toBe(false) // Should not move into wall
      expect(result.safeMoves).not.toContain('left')
    })

    it('should handle crowded small map with multiple snakes', () => {
      const otherSnakes = [
        {
          id: 'enemy1',
          name: 'Enemy 1',
          health: 80,
          body: [
            { x: 5, y: 3 },
            { x: 5, y: 2 },
            { x: 5, y: 1 },
          ],
          head: { x: 5, y: 3 },
          length: 3,
        },
      ]

      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 2, y: 3 },
        3,
        [{ x: 3, y: 5 }],
        otherSnakes
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.move).toBeTruthy()
    })
  })

  describe('Medium Map (11x11)', () => {
    const mapSize = { width: 11, height: 11 }

    it('should handle standard battlesnake map size', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 5, y: 5 }, // Center
        4,
        [
          { x: 8, y: 8 },
          { x: 2, y: 2 },
        ] // Multiple food sources
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.bestScore).toBeGreaterThan(-Infinity)
    })

    it('should efficiently navigate medium-sized spaces', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 1, y: 1 }, // Corner start
        3,
        [{ x: 9, y: 9 }] // Food at opposite corner
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      // Should prefer moves that get closer to food
      expect(['up', 'right']).toContain(result.move)
    })
  })

  describe('Large Map (19x19)', () => {
    const mapSize = { width: 19, height: 19 }

    it('should handle large open spaces effectively', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 9, y: 9 }, // Center of large map
        5,
        [
          { x: 15, y: 15 },
          { x: 3, y: 3 },
          { x: 9, y: 15 },
        ] // Scattered food
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.bestScore).toBeGreaterThan(-Infinity)
    })

    it('should not be constrained by walls in large map center', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 9, y: 9 }, // Dead center
        3,
        [{ x: 15, y: 15 }] // Add food
      )

      const result = simulateMainMoveLogic(gameState)

      // In center of large map, should have multiple safe moves
      expect(result.safeMoves.length).toBeGreaterThanOrEqual(3)
    })

    it('should handle multiple snakes on large map', () => {
      const otherSnakes = [
        {
          id: 'enemy1',
          name: 'Enemy 1',
          health: 80,
          body: [
            { x: 5, y: 5 },
            { x: 5, y: 4 },
            { x: 5, y: 3 },
          ],
          head: { x: 5, y: 5 },
          length: 3,
        },
        {
          id: 'enemy2',
          name: 'Enemy 2',
          health: 90,
          body: [
            { x: 15, y: 15 },
            { x: 14, y: 15 },
            { x: 13, y: 15 },
          ],
          head: { x: 15, y: 15 },
          length: 3,
        },
      ]

      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 10, y: 10 },
        4,
        [{ x: 12, y: 12 }],
        otherSnakes
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.move).toBeTruthy()
    })
  })

  describe('Extra Large Map (25x25)', () => {
    const mapSize = { width: 25, height: 25 }

    it('should handle very large battlesnake maps', () => {
      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 12, y: 12 }, // Center
        6,
        [
          { x: 5, y: 5 },
          { x: 20, y: 20 },
          { x: 12, y: 5 },
        ]
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.bestScore).toBeGreaterThan(-Infinity)
    })

    it('should maintain performance on very large maps', () => {
      const start = Date.now()

      const gameState = createGameState(
        mapSize.width,
        mapSize.height,
        { x: 12, y: 12 },
        8,
        [
          { x: 1, y: 1 },
          { x: 23, y: 23 },
          { x: 1, y: 23 },
          { x: 23, y: 1 },
        ]
      )

      const result = simulateMainMoveLogic(gameState)
      const executionTime = Date.now() - start

      expect(result.move).toBeTruthy()
      expect(executionTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Edge Cases Across Map Sizes', () => {
    it('should handle long snake on small map', () => {
      const gameState = createGameState(
        7,
        7,
        { x: 3, y: 6 }, // Near top
        15, // Very long snake for small map
        [{ x: 1, y: 1 }]
      )

      const result = simulateMainMoveLogic(gameState)

      // Should still find a move even with long snake
      expect(result.move).toBeTruthy()
    })

    it('should handle very short snake on large map', () => {
      const gameState = createGameState(
        25,
        25,
        { x: 12, y: 12 },
        2, // Very short snake
        [{ x: 15, y: 15 }]
      )

      const result = simulateMainMoveLogic(gameState)

      expect(result.safeMoves.length).toBeGreaterThan(0)
      expect(result.move).toBeTruthy()
    })

    it('should prefer space-efficient moves on small maps', () => {
      const gameState = createGameState(7, 7, { x: 1, y: 1 }, 3, [
        { x: 5, y: 5 },
      ])

      const result = simulateMainMoveLogic(gameState)

      // On small map, should avoid getting trapped
      expect(result.safeMoves.length).toBeGreaterThan(0)
    })

    it('should handle map boundaries correctly across all sizes', () => {
      const mapSizes = [
        { width: 7, height: 7 },
        { width: 11, height: 11 },
        { width: 19, height: 19 },
        { width: 25, height: 25 },
      ]

      for (const { width, height } of mapSizes) {
        // Test corners
        const corners = [
          { x: 0, y: 0 },
          { x: width - 1, y: 0 },
          { x: 0, y: height - 1 },
          { x: width - 1, y: height - 1 },
        ]

        for (const corner of corners) {
          const gameState = createGameState(width, height, corner, 3, [
            { x: Math.floor(width / 2), y: Math.floor(height / 2) },
          ])
          const result = simulateMainMoveLogic(gameState)

          expect(result.move).toBeTruthy()
          expect(result.safeMoves.length).toBeGreaterThan(0)
        }
      }
    })
  })
})
