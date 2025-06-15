// snake/modes/royale.js

/**
 * Check if the game is in Royale mode.
 * @param {object} gameState
 * @returns {boolean}
 */
export function isRoyaleMode(gameState) {
  return Boolean(gameState.rulesetSettings?.royale?.shrinkEveryNTurns)
}

/**
 * Avoid moving into hazard tiles in Royale mode, unless health is sufficient.
 * @param {object} gameState
 * @param {object} isMoveSafe
 * @returns {object}
 */
export function avoidHazards(gameState, isMoveSafe) {
  if (!isRoyaleMode(gameState)) return isMoveSafe

  const hazards = gameState.board.hazards || []
  const head = gameState.you.body[0]
  const health = gameState.you.health
  const hazardDamage =
    gameState.rulesetSettings.royale?.hazardDamagePerTurn || 14

  const getNextPosition = (dir) => {
    switch (dir) {
      case 'up': {
        return { x: head.x, y: head.y + 1 }
      }
      case 'down': {
        return { x: head.x, y: head.y - 1 }
      }
      case 'left': {
        return { x: head.x - 1, y: head.y }
      }
      case 'right': {
        return { x: head.x + 1, y: head.y }
      }
    }
  }

  for (const direction of Object.keys(isMoveSafe)) {
    if (!isMoveSafe[direction]) continue
    const next = getNextPosition(direction)
    const isHazard = hazards.some((h) => h.x === next.x && h.y === next.y)
    if (isHazard && health <= hazardDamage + 1) {
      isMoveSafe[direction] = false
    }
  }

  return isMoveSafe
}
