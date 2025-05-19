import { moveTowardClosestFood } from '../../snake/movement/moveTowardsClosestFood.js';

describe('moveTowardClosestFood', () => {
  it('prioritizes move towards food when safe', () => {
    const gameState = {
      you: {
        body: [{ x: 5, y: 5 }]
      },
      board: {
        food: [
          { x: 7, y: 5 }
        ]
      }
    };

    const isMoveSafe = { up: true, down: true, left: true, right: true };
    const result = moveTowardClosestFood(gameState, isMoveSafe);

    const topMove = Object.keys(result).find((key) => result[key]);
    expect(topMove).toBe('right');
  });

  it('does not include unsafe moves in prioritized list', () => {
    const gameState = {
      you: {
        body: [{ x: 5, y: 5 }]
      },
      board: {
        food: [
          { x: 7, y: 5 }
        ]
      }
    };

    const isMoveSafe = { up: true, down: true, left: true, right: false };
    const result = moveTowardClosestFood(gameState, isMoveSafe);

    expect(result.right).toBe(false);
  });
});
