// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';
import chalk from 'chalk';
import { preventSelfCollision } from './snakeMovement.js';
import { avoidWalls } from './snakeMovement.js';
import { avoidCollisionsWithOtherSnakes } from './snakeMovement.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "ElCobra",       // TODO: Your Battlesnake Username
    color: "#08C6C7", // TODO: Choose color
    head: "silly",  // TODO: Choose head
    tail: "round-bum",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  isMoveSafe = avoidWalls(gameState, isMoveSafe);
  
  // TODO 2 - Ensuring that battlesnake does not collide with itself
  isMoveSafe = preventSelfCollision(gameState, isMoveSafe);

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  isMoveSafe = avoidCollisionsWithOtherSnakes(gameState, isMoveSafe);

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;
  console.log(printBoard(gameState.board));
  console.log("The gamestate is: ", gameState);
  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}
function printBoard(g) {
  const board = g;
  const printBoard = Array.from({ length: board.height }, () => Array(board.width).fill('.'));
  board.food.forEach(food => {
    printBoard[food.y][food.x] = chalk.red('F'); 
  });
  board.snakes.forEach(snake => {
    snake.body.forEach(segment => {
      printBoard[segment.y][segment.x] = chalk.green('S'); 
    });
  });
  for (let row = board.height - 1; row >= 0; row--) {
    console.log(printBoard[row].join(' '));
  }
}
runServer({
  info: info,
  start: start,
  move: move,
  end: end
});