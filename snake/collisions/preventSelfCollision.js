export function preventSelfCollision(gameState, isMoveSafe) {
  const myBody = gameState.you.body
  const myHead = gameState.you.body[0]

  for (const move of Object.keys(isMoveSafe)) {
    if (isMoveSafe[move]) {
      let nextHeadPosition = { x: myHead.x, y: myHead.y }

      switch (move) {
        case 'up': {
          nextHeadPosition.y += 1

          break
        }
        case 'down': {
          nextHeadPosition.y -= 1

          break
        }
        case 'left': {
          nextHeadPosition.x -= 1

          break
        }
        case 'right': {
          nextHeadPosition.x += 1

          break
        }
        // No default
      }

      // Exclude the neck (second body segment) from the collision check
      const bodyToCheck = myBody.slice(1)

      // Check if the next head position collides with any part of the body
      if (
        bodyToCheck.some(
          (segment) =>
            segment.x === nextHeadPosition.x && segment.y === nextHeadPosition.y
        )
      ) {
        isMoveSafe[move] = false
      }
    }
  }

  return isMoveSafe
}
