import { avoidCollisionsWithOtherSnakes } from '../../snake/collisions/avoidCollisionWithOtherSnakes'

describe('avoidCollisionsWithOtherSnakes', () => {
  test('should mark directions as unsafe if another snake is adjacent', () => {
    const gameState = {
      you: {
        body: [{ x: 2, y: 2 }],
      },
      board: {
        food: [],
        snakes: [
          {
            body: [
              { x: 3, y: 2 }, // right of you
              { x: 3, y: 3 },
              { x: 3, y: 4 },
            ],
          },
          {
            body: [
              { x: 2, y: 3 }, // up
              { x: 1, y: 3 },
              { x: 0, y: 3 },
            ],
          },
        ],
      },
    }

    const isMoveSafe = {
      up: true,
      down: true,
      left: true,
      right: true,
    }

    const result = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)

    expect(result).toEqual({
      up: false,
      down: true,
      left: true,
      right: false,
    })
  })

  test('should ignore tail segment if snake is not eating food', () => {
    const gameState = {
      you: {
        body: [{ x: 2, y: 2 }],
      },
      board: {
        food: [],
        snakes: [
          {
            body: [
              { x: 1, y: 2 }, // left
              { x: 0, y: 2 },
              { x: 0, y: 1 }, // tail — will be ignored
            ],
          },
        ],
      },
    }

    const isMoveSafe = {
      up: true,
      down: true,
      left: true,
      right: true,
    }

    const result = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)

    expect(result).toEqual({
      up: true,
      down: true,
      left: false,
      right: true,
    })
  })

  test('should NOT ignore tail segment if snake will eat food', () => {
    const gameState = {
      you: {
        body: [{ x: 2, y: 2 }],
      },
      board: {
        food: [{ x: 2, y: 2 }], // snake's next head pos
        snakes: [
          {
            body: [
              { x: 1, y: 2 }, // head
              { x: 0, y: 2 }, // neck
              { x: 0, y: 1 }, // tail
            ],
          },
        ],
      },
    }

    const isMoveSafe = {
      up: true,
      down: true,
      left: true,
      right: true,
    }

    const result = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe)

    // We're at (2,2), snake tail is at (0,1) — to our left is (1,2), not tail, so left is unsafe because of snake head at (1,2)
    expect(result).toEqual({
      up: true,
      down: true,
      left: false,
      right: true,
    })
  })
})
