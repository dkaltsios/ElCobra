export function moveTowardClosestFood(gameState, isMoveSafe) {
    const myHead = gameState.you.body[0]
    function getClosestFood() {
        let closestFood
    let closestDistance = Infinity
    for (const food of gameState.board.food) {
        const distance = getDistanceFromTo(myHead.x, myHead.y, food.x, food.y)
      if (distance < closestDistance) {
        closestFood = food
        closestDistance = distance
      }
    }
    return closestFood
}

const closestFood = getClosestFood()
let closestFoodDirection = []
let newIsMoveSafe = {}

if (closestFood.x == myHead.x) {
    closestFoodDirection =
    closestFood.y > myHead.y
    ? ['up', 'right', 'left', 'down']
    : ['down', 'right', 'left', 'up']
} else if (closestFood.x > myHead.x) {
    if (closestFood.y == myHead.y) {
        closestFoodDirection = ['right', 'up', 'down', 'left']
    } else if (closestFood.y > myHead.y) {
        closestFoodDirection = ['right', 'up', 'left', 'down']
    } else {
        closestFoodDirection = ['right', 'down', 'left', 'up']
    }
} else {
    if (closestFood.y == myHead.y) {
        closestFoodDirection = ['left', 'up', 'down', 'right']
    } else if (closestFood.y > myHead.y) {
        closestFoodDirection = ['left', 'up', 'right', 'down']
    } else {
        closestFoodDirection = ['left', 'down', 'right', 'up']
    }
}

for (const move of closestFoodDirection) {
    newIsMoveSafe[move] = isMoveSafe[move]
}
return newIsMoveSafe
}
function getDistanceFromTo(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}
