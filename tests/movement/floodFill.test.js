import {
  floodFillBoard,
  filterDeadEndMoves,
} from '../../snake/movement/floodFill.js'

describe('floodFillBoard', () => {
  const emptyBoard = { width: 3, height: 3, snakes: [], hazards: [] }

  it('counts full area on empty board', () => {
    expect(floodFillBoard(emptyBoard, { x: 1, y: 1 })).toBe(9)
  })

  it('returns 0 if start is blocked by snake body', () => {
    const board = {
      width: 2,
      height: 2,
      snakes: [{ body: [{ x: 0, y: 0 }] }],
      hazards: [],
    }
    expect(floodFillBoard(board, { x: 0, y: 0 })).toBe(0)
  })
})

describe('filterDeadEndMoves', () => {
  it('marks moves into one-cell dead-ends as unsafe', () => {
    const gameState = {
      you: { head: { x: 1, y: 1 } },
      board: {
        width: 3,
        height: 3,
        snakes: [{ body: [{ x: 1, y: 2 }] }], // blocks down
        hazards: [],
      },
    }
    // initial safe moves all true
    const isMoveSafe = { up: true, down: true, left: true, right: true }
    // down blocked -> area=0, up and left/right lead to area >1 except up leads into top row with area=1
    // Actually, snake at (1,2) blocks down. Starting up at (1,0) area <=1.
    const result = filterDeadEndMoves(gameState, isMoveSafe)
    expect(result.down).toBe(true) // blocked
    expect(result.up).toBe(false) // dead-end cell at (1,0)
    expect(result.left).toBe(true) // open
    expect(result.right).toBe(true) // open
  })

  it('preserves already false flags', () => {
    const gameState = {
      you: { head: { x: 0, y: 0 } },
      board: { width: 2, height: 2, snakes: [], hazards: [] },
    }
    const isMoveSafe = { up: false, right: true, down: true, left: false }
    const res = filterDeadEndMoves(gameState, isMoveSafe)
    expect(res.up).toBe(false)
    expect(res.left).toBe(false)
    expect(res.right).toBe(true)
    expect(res.down).toBe(false)
  })
})
