// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/pseudo-random */
/**
 * @file Performance and scalability tests for different map sizes
 * Tests execution time, memory usage patterns, and decision quality across map sizes
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
 * Helper function to create a complex game state for stress testing
 * @param {number} width - Board width
 * @param {number} height - Board height
 * @param {number} numSnakes - Number of snakes to create
 * @param {number} numFood - Number of food items
 * @returns {object} Complex game state
 */
function createComplexGameState(width, height, numSnakes = 4, numFood = 8) {
  const snakes = []
  const food = []

  // Create main snake (our snake)
  const mainSnakeHead = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  }
  const mainSnakeBody = [
    mainSnakeHead,
    { x: mainSnakeHead.x, y: mainSnakeHead.y - 1 },
    { x: mainSnakeHead.x, y: mainSnakeHead.y - 2 },
  ]

  const mainSnake = {
    id: 'my-snake',
    name: 'Test Snake',
    health: 90,
    body: mainSnakeBody,
    head: mainSnakeHead,
    length: 3,
    latency: '50ms',
    shout: '',
  }
  snakes.push(mainSnake)

  // Create other snakes
  for (let i = 1; i < numSnakes; i++) {
    const x = Math.floor(Math.random() * (width - 2)) + 1
    const y = Math.floor(Math.random() * (height - 2)) + 1

    // Ensure snakes don't spawn on top of each other
    const occupied = snakes.some((snake) =>
      snake.body.some((segment) => segment.x === x && segment.y === y)
    )

    if (!occupied) {
      const snakeBody = [
        { x, y },
        { x, y: Math.max(0, y - 1) },
        { x, y: Math.max(0, y - 2) },
      ]

      snakes.push({
        id: `enemy-${i}`,
        name: `Enemy ${i}`,
        health: 80 + Math.floor(Math.random() * 20),
        body: snakeBody,
        head: snakeBody[0],
        length: snakeBody.length,
        latency: '50ms',
        shout: '',
      })
    }
  }

  // Create food items
  for (let i = 0; i < numFood; i++) {
    let x, y
    let attempts = 0
    do {
      x = Math.floor(Math.random() * width)
      y = Math.floor(Math.random() * height)
      attempts++
    } while (
      attempts < 100 &&
      (snakes.some((snake) =>
        snake.body.some((segment) => segment.x === x && segment.y === y)
      ) ||
        food.some((f) => f.x === x && f.y === y))
    )

    if (attempts < 100) {
      food.push({ x, y })
    }
  }

  return {
    game: {
      id: 'stress-test-game',
      ruleset: { name: 'standard' },
      timeout: 500,
    },
    turn: Math.floor(Math.random() * 100) + 1,
    board: {
      width,
      height,
      food,
      snakes,
      hazards: [],
    },
    you: mainSnake,
  }
}

/**
 * Runs the complete snake logic and measures performance
 * @param {object} gameState - Game state to test
 * @returns {object} Performance metrics and result
 */
function measureSnakePerformance(gameState) {
  const startTime = process.hrtime.bigint()
  const startMemory = process.memoryUsage()

  let isMoveSafe = { up: true, down: true, left: true, right: true }

  // Apply neck collision avoidance
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

  // Apply all collision detection and movement logic
  isMoveSafe = avoidWalls(gameState, isMoveSafe)
  isMoveSafe = preventSelfCollision(gameState, isMoveSafe)
  isMoveSafe = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)
  isMoveSafe = avoidHeadToHead(gameState, isMoveSafe)
  isMoveSafe = moveTowardClosestFood(gameState, isMoveSafe)
  isMoveSafe = filterDeadEndMoves(gameState, isMoveSafe)

  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key])

  let bestMove = 'down'
  let bestScore = -Infinity

  if (safeMoves.length > 0) {
    bestMove = safeMoves[0]

    // Evaluate each safe move
    for (const move of safeMoves) {
      const simulatedGameState = simulateMove(gameState, move)
      const score = evaluateGameState(simulatedGameState)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }
  }

  const endTime = process.hrtime.bigint()
  const endMemory = process.memoryUsage()

  const executionTime = Number(endTime - startTime) / 1_000_000 // Convert to milliseconds
  const memoryDelta = endMemory.heapUsed - startMemory.heapUsed

  return {
    move: bestMove,
    safeMoves,
    bestScore,
    executionTime,
    memoryDelta,
    boardSize: gameState.board.width * gameState.board.height,
    numSnakes: gameState.board.snakes.length,
    numFood: gameState.board.food.length,
  }
}

describe('Performance and Scalability Tests', () => {
  describe('Execution Time Tests', () => {
    it('should complete moves within reasonable time on small maps', () => {
      const gameState = createComplexGameState(7, 7, 3, 4)
      const result = measureSnakePerformance(gameState)

      expect(result.executionTime).toBeLessThan(50) // Less than 50ms
      expect(result.move).toBeTruthy()
    })

    it('should complete moves within reasonable time on medium maps', () => {
      const gameState = createComplexGameState(11, 11, 4, 6)
      const result = measureSnakePerformance(gameState)

      expect(result.executionTime).toBeLessThan(100) // Less than 100ms
      expect(result.move).toBeTruthy()
    })

    it('should complete moves within reasonable time on large maps', () => {
      const gameState = createComplexGameState(19, 19, 6, 10)
      const result = measureSnakePerformance(gameState)

      expect(result.executionTime).toBeLessThan(200) // Less than 200ms
      expect(result.move).toBeTruthy()
    })

    it('should complete moves within reasonable time on extra large maps', () => {
      const gameState = createComplexGameState(25, 25, 8, 15)
      const result = measureSnakePerformance(gameState)

      expect(result.executionTime).toBeLessThan(300) // Less than 300ms
      expect(result.move).toBeTruthy()
    })
  })

  describe('Scalability Tests', () => {
    it('should handle increasing numbers of snakes efficiently', () => {
      const mapSizes = [
        { width: 11, height: 11, maxSnakes: 4 },
        { width: 19, height: 19, maxSnakes: 8 },
        { width: 25, height: 25, maxSnakes: 12 },
      ]

      for (const { width, height, maxSnakes } of mapSizes) {
        // eslint-disable-next-line sonarjs/no-redundant-assignments
        for (let numSnakes = 2; numSnakes <= maxSnakes; numSnakes += 2) {
          const gameState = createComplexGameState(width, height, numSnakes, 8)
          const result = measureSnakePerformance(gameState)

          expect(result.executionTime).toBeLessThan(500)
          expect(result.move).toBeTruthy()
          expect(result.safeMoves).toBeDefined()
        }
      }
    })

    it('should handle increasing amounts of food efficiently', () => {
      const baseMapSize = { width: 15, height: 15 }

      for (let numFood = 5; numFood <= 30; numFood += 5) {
        const gameState = createComplexGameState(
          baseMapSize.width,
          baseMapSize.height,
          4,
          numFood
        )
        const result = measureSnakePerformance(gameState)

        expect(result.executionTime).toBeLessThan(400)
        expect(result.move).toBeTruthy()
      }
    })
  })

  describe('Stress Tests', () => {
    it('should handle worst-case scenario on small map', () => {
      // Small map with maximum snakes and food
      const gameState = createComplexGameState(7, 7, 4, 8)
      const result = measureSnakePerformance(gameState)

      expect(result.move).toBeTruthy()
      expect(result.executionTime).toBeLessThan(1000)
    })

    it('should handle worst-case scenario on large map', () => {
      // Large map with many snakes and food
      const gameState = createComplexGameState(25, 25, 10, 20)
      const result = measureSnakePerformance(gameState)

      expect(result.move).toBeTruthy()
      expect(result.executionTime).toBeLessThan(1000)
    })

    it('should maintain consistent performance across multiple turns', () => {
      const gameState = createComplexGameState(15, 15, 6, 10)
      const results = []

      // Run 10 iterations to test consistency
      for (let i = 0; i < 10; i++) {
        gameState.turn = i + 1
        const result = measureSnakePerformance(gameState)
        results.push(result.executionTime)
      }

      const avgTime = results.reduce((a, b) => a + b, 0) / results.length
      const maxTime = Math.max(...results)
      const minTime = Math.min(...results)

      expect(avgTime).toBeLessThan(300)
      expect(maxTime - minTime).toBeLessThan(200) // Consistent performance
    })
  })

  describe('Decision Quality Tests', () => {
    it('should make better decisions with more space available', () => {
      const smallMapState = createComplexGameState(7, 7, 3, 4)
      const largeMapState = createComplexGameState(19, 19, 3, 4)

      const smallResult = measureSnakePerformance(smallMapState)
      const largeResult = measureSnakePerformance(largeMapState)

      // Large map should generally have more safe moves available
      expect(largeResult.safeMoves.length).toBeGreaterThanOrEqual(
        smallResult.safeMoves.length
      )
    })

    it('should adapt strategy based on map density', () => {
      // Crowded small map
      const crowdedState = createComplexGameState(7, 7, 4, 2)
      // Sparse large map
      const sparseState = createComplexGameState(19, 19, 2, 8)

      const crowdedResult = measureSnakePerformance(crowdedState)
      const sparseResult = measureSnakePerformance(sparseState)

      expect(crowdedResult.move).toBeTruthy()
      expect(sparseResult.move).toBeTruthy()

      // Both should find valid moves despite different conditions
      expect(crowdedResult.safeMoves.length).toBeGreaterThan(0)
      expect(sparseResult.safeMoves.length).toBeGreaterThan(0)
    })
  })

  describe('Memory Usage Tests', () => {
    it('should not cause excessive memory allocation on large maps', () => {
      const gameState = createComplexGameState(25, 25, 8, 15)
      const result = measureSnakePerformance(gameState)

      // Memory delta should be reasonable (less than 10MB)
      expect(Math.abs(result.memoryDelta)).toBeLessThan(10 * 1024 * 1024)
      expect(result.move).toBeTruthy()
    })

    it('should handle repeated executions without memory leaks', () => {
      const gameState = createComplexGameState(15, 15, 5, 8)
      const initialMemory = process.memoryUsage().heapUsed

      // Run many iterations
      for (let i = 0; i < 50; i++) {
        measureSnakePerformance(gameState)
      }

      // Force garbage collection if available
      if (globalThis.gc) {
        globalThis.gc()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryGrowth = finalMemory - initialMemory

      // Memory growth should be minimal (less than 50MB)
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024)
    })
  })
})
