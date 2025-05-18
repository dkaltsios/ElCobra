import { preventSelfCollision } from '../../snake/collisions/preventSelfCollision.js';

describe('preventSelfCollision', () => {
  it('marks move unsafe if it leads to self collision', () => {
    const gameState = {
      you: {
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 4 },
          { x: 5, y: 3 }
        ]
      }
    };

    const isMoveSafe = { up: true, down: true, left: true, right: true };
    const result = preventSelfCollision(gameState, isMoveSafe);

    expect(result.down).toBe(false);
  });

  it('keeps move safe if it does not lead to self collision', () => {
    const gameState = {
      you: {
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 4 },
          { x: 4, y: 4 }
        ]
      }
    };

    const isMoveSafe = { up: true, down: true, left: true, right: true };
    const result = preventSelfCollision(gameState, isMoveSafe);

    expect(result.right).toBe(true);
  });
});
