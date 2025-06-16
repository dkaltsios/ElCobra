import { findPath } from '../../snake/pathfinding/aStar.js'

describe('A* Pathfinding', () => {
  test('should find a straight path to food with no obstacles', () => {
    const board = {
      width: 11,
      height: 11,
      snakes: [],
    }

    const start = { x: 2, y: 2 }
    const goal = { x: 5, y: 2 }

    const path = findPath(start, goal, board)

    expect(path).toEqual([
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
    ])
  })
})
