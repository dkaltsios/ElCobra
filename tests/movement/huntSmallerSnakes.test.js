import { huntSmallerSnakes } from '../../snake/movement/huntSmallerSnakes.js'

describe('huntSmallerSnakes', () => {
  it('returns a move that would attack a smaller snake head', () => {
    const gameState = {
      you: {
        id: 'me',
        body: [
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
        ],
      },
      board: {
        snakes: [
          {
            id: 'me',
            body: [
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
            ],
          },
          {
            id: 'small',
            body: [
              { x: 3, y: 2 },
              { x: 3, y: 1 },
            ],
          },
        ],
      },
    }
    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = huntSmallerSnakes(gameState, isMoveSafe)
    expect(result.right).toBe(true)
  })

  it('does not return moves if no smaller snake is adjacent', () => {
    const gameState = {
      you: {
        id: 'me',
        body: [
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
        ],
      },
      board: {
        snakes: [
          {
            id: 'me',
            body: [
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
            ],
          },
          {
            id: 'small',
            body: [
              { x: 5, y: 5 },
              { x: 5, y: 4 },
            ],
          },
        ],
      },
    }
    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = huntSmallerSnakes(gameState, isMoveSafe)
    expect(Object.values(result).some(Boolean)).toBe(false)
  })

  it('does not hunt snakes of equal or greater length', () => {
    const gameState = {
      you: {
        id: 'me',
        body: [
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
        ],
      },
      board: {
        snakes: [
          {
            id: 'me',
            body: [
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
            ],
          },
          {
            id: 'big',
            body: [
              { x: 3, y: 2 },
              { x: 3, y: 1 },
              { x: 3, y: 0 },
            ],
          },
        ],
      },
    }
    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = huntSmallerSnakes(gameState, isMoveSafe)
    expect(Object.values(result).some(Boolean)).toBe(false)
  })

  it('only returns moves that are also safe', () => {
    const gameState = {
      you: {
        id: 'me',
        body: [
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
        ],
      },
      board: {
        snakes: [
          {
            id: 'me',
            body: [
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
            ],
          },
          {
            id: 'small',
            body: [
              { x: 3, y: 2 },
              { x: 3, y: 1 },
            ],
          },
        ],
      },
    }
    const isMoveSafe = { up: false, down: false, left: false, right: true }
    const result = huntSmallerSnakes(gameState, isMoveSafe)
    expect(result.right).toBe(true)
    expect(result.up).toBeFalsy()
    expect(result.down).toBeFalsy()
    expect(result.left).toBeFalsy()
  })
})
