import { avoidHeadToHead } from '../../snake/collisions/avoidHeadToHead.js'

describe('avoidHeadToHead', () => {
  it('marks move unsafe if another equal or larger snake can move there', () => {
    const gameState = {
      you: {
        id: '1',
        head: { x: 5, y: 5 },
        body: [{ x: 5, y: 5 }],
        length: 3,
      },
      board: {
        snakes: [
          {
            id: '2',
            head: { x: 6, y: 5 },
            body: [{ x: 6, y: 5 }],
            length: 3,
          },
        ],
      },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidHeadToHead(gameState, { ...isMoveSafe })

    expect(result.right).toBe(true)
  })
})
