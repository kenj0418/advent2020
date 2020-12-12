const {readStringArrayFromFile} = require("./lib");

const EAST = {x:1, y:0}
const WEST = {x:-1, y:0}
const NORTH ={x:0, y:-1}
const SOUTH = {x:0, y:1}
const dirs = [NORTH, WEST, SOUTH, EAST];

const taxiDist = (ship) => {
  return Math.abs(ship.x) + Math.abs(ship.y);
}

const move = (ship, dir, qty) => {
  ship.x += dir.x * qty;
  ship.y += dir.y * qty;
}

const rot = (ship, deg) => {
  const degIndex = Math.floor(deg / 90);
  ship.dirIndex = (ship.dirIndex + degIndex) % 4;
  ship.dir = dirs[ship.dirIndex];  
}


const moveForEach = (ship, instr) => {
  const action = instr.slice(0,1);
  const qty = parseInt(instr.slice(1));

  switch (action) {
    case "N": move(ship, NORTH, qty); break;
    case "S": move(ship, SOUTH, qty); break;
    case "W": move(ship, WEST, qty); break;
    case "E": move(ship, EAST, qty); break;
    case "F": move(ship, ship.dir, qty); break;
    case "L": rot(ship, qty); break;
    case "R": rot(ship, 360 - qty); break;
    default: throw new Error(action);
  }
}

const moveForInstructions = (ship, instructions) => {
  instructions.forEach((instr) => {moveForEach(ship, instr)});
}

const run = () => {
  let st = readStringArrayFromFile("./input/day12.txt", "\n");
  
  let ship = {
    dir: EAST,
    dirIndex: 3,
    x: 0,
    y: 0
  }

  moveForInstructions(ship, st);

  console.log(`Day 12 part 1:  ${taxiDist(ship)}`);

  // console.log(`Day 12 part 2:  ${0}`);
}

module.exports = { run };
