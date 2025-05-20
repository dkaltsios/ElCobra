import { avoidWalls } from '../../snake/collisions/avoidWalls.js'

describe('avoidWalls', () => {
  it('marks left move unsafe when at left wall', () => {
    const gameState = {
      board: { width: 11, height: 11 },
      you: { body: [{ x: 0, y: 5 }] },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidWalls(gameState, isMoveSafe)

    expect(result.left).toBe(false)
  })

  it('marks up move unsafe when at top wall', () => {
    const gameState = {
      board: { width: 11, height: 11 },
      you: { body: [{ x: 5, y: 10 }] },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidWalls(gameState, isMoveSafe)

    expect(result.up).toBe(false)
  })
})
