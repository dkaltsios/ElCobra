import { simulateMove } from '../../snake/movement/simulateMove.js'

describe('simulateMove', () => {
  let mockGameState

  beforeEach(() => {
    mockGameState = {
      you: {
        health: 90,
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 4 },
          { x: 5, y: 3 },
        ],
      },
      board: {
        food: [
          { x: 5, y: 6 },
          { x: 0, y: 0 },
        ],
      },
    }
  })

  it('should move up and update head, body, and health correctly', () => {
    const newState = simulateMove(mockGameState, 'up')

    expect(newState.you.body[0]).toEqual({ x: 5, y: 6 }) // new head
    expect(newState.you.body.length).toBe(4) // grew because food at (5,6)
    expect(newState.you.health).toBe(100) // reset due to eating food
    expect(newState.board.food).toEqual([{ x: 0, y: 0 }]) // removed eaten food
  })

  it('should move left without eating and reduce health by 1', () => {
    const newState = simulateMove(mockGameState, 'left')

    expect(newState.you.body[0]).toEqual({ x: 4, y: 5 }) // new head
    expect(newState.you.body.length).toBe(3) // no growth
    expect(newState.you.health).toBe(89) // reduced by 1
    expect(newState.board.food).toEqual(mockGameState.board.food) // food untouched
  })

  it('should deep clone game state (original is not mutated)', () => {
    const originalCopy = JSON.stringify(mockGameState)
    simulateMove(mockGameState, 'right')
    expect(JSON.stringify(mockGameState)).toBe(originalCopy)
  })
})
