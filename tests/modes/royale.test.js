import { avoidHazards } from '../../snake/modes/royale.js'

describe('Royale Mode - avoidHazards()', () => {
  const baseGameState = {
    rulesetSettings: {
      royale: {
        shrinkEveryNTurns: 10,
        hazardDamagePerTurn: 14,
      },
    },
    you: {
      id: 'me',
      health: 15,
      body: [{ x: 2, y: 2 }],
    },
    board: {
      hazards: [],
      snakes: [],
    },
  }

  it('does nothing if not in Royale mode', () => {
    const state = { ...baseGameState, rulesetSettings: {} }
    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidHazards(state, { ...isMoveSafe })
    expect(result).toEqual(isMoveSafe)
  })

  it('blocks move into hazard when health too low', () => {
    const state = {
      ...baseGameState,
      board: {
        hazards: [{ x: 3, y: 2 }],
        snakes: [],
      },
      you: { ...baseGameState.you, health: 15 },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidHazards(state, { ...isMoveSafe })

    expect(result.right).toBe(false)
    expect(result.left).toBe(true)
    expect(result.up).toBe(true)
    expect(result.down).toBe(true)
  })

  it('allows move into hazard when health is high enough', () => {
    const state = {
      ...baseGameState,
      you: { ...baseGameState.you, health: 20 },
      board: {
        hazards: [{ x: 3, y: 2 }],
        snakes: [],
      },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidHazards(state, { ...isMoveSafe })

    expect(result.right).toBe(true)
  })

  it('does not block non-hazard directions', () => {
    const state = {
      ...baseGameState,
      you: { ...baseGameState.you, health: 10 },
      board: {
        hazards: [{ x: 3, y: 2 }],
        snakes: [],
      },
    }

    const isMoveSafe = { up: true, down: true, left: true, right: true }
    const result = avoidHazards(state, { ...isMoveSafe })

    expect(result.left).toBe(true)
    expect(result.up).toBe(true)
    expect(result.down).toBe(true)
    expect(result.right).toBe(false) // hazard
  })
})
