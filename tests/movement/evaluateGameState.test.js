import { evaluateGameState } from '../../snake/movement/evaluateGameState.js';

describe('evaluateGameState', () => {
  it('returns higher score for longer snake', () => {
    const shortSnake = {
      you: { head: { x: 1, y: 1 }, health: 90, length: 3 },
      board: { food: [] }
    };

    const longSnake = {
      you: { head: { x: 1, y: 1 }, health: 90, length: 8 },
      board: { food: [] }
    };

    expect(evaluateGameState(longSnake)).toBeGreaterThan(evaluateGameState(shortSnake));
  });

  it('returns lower score when food is far compared to when food is close', () => {
    const farFoodState = {
      you: { head: { x: 0, y: 0 }, health: 20, length: 5 },
      board: { food: [{ x: 9, y: 9 }] }
    };

    const closeFoodState = {
      you: { head: { x: 0, y: 0 }, health: 20, length: 5 },
      board: { food: [{ x: 1, y: 1 }] }
    };

    const farScore = evaluateGameState(farFoodState);
    const closeScore = evaluateGameState(closeFoodState);

    expect(closeScore).toBeGreaterThan(farScore);
  });

  it('adds health and length even if no food is present', () => {
    const gameState = {
      you: { head: { x: 0, y: 0 }, health: 80, length: 4 },
      board: { food: [] }
    };

    const score = evaluateGameState(gameState);
    expect(score).toBe(80 + 4 * 10); // health + length*10
  });
});
