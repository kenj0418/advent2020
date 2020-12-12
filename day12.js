const {readStringArrayFromFile} = require("./lib");

const EAST = {x:1, y:0}
const WEST = {x:-1, y:0}
const NORTH ={x:0, y:1}
const SOUTH = {x:0, y:-1}

const taxiDist = (ship) => {
  return Math.abs(ship.x) + Math.abs(ship.y);
}

const moveWay = (ship, dir, qty) => {
  ship.way.x += dir.x * qty;
  ship.way.y += dir.y * qty;
}

const rotWay = (ship, deg) => {
  const tempX = ship.way.x;
  const tempY = ship.way.y;
  if (deg == 0 || deg == 360) {
    // nothing
  } else if (deg == 180 || deg == -180) {
    ship.way.x = -tempX;
    ship.way.y = -tempY;
  } else if (deg == 90 || deg == -270) {
    ship.way.x = -tempY;
    ship.way.y = tempX;
  } else if (deg == 270 || deg == -90) {
    ship.way.x = tempY;
    ship.way.y = -tempX;
  } else {
    throw new Error(deg)
  }
}

const forward = (ship, qty) => {
  ship.x += ship.way.x * qty;
  ship.y += ship.way.y * qty;
}


const moveForEach = (ship, instr) => {
  const action = instr.slice(0,1);
  const qty = parseInt(instr.slice(1));

  switch (action) {
    case "N": moveWay(ship, NORTH, qty); break;
    case "S": moveWay(ship, SOUTH, qty); break;
    case "W": moveWay(ship, WEST, qty); break;
    case "E": moveWay(ship, EAST, qty); break;
    case "F": forward(ship, qty); break;
    case "L": rotWay(ship, qty); break;
    case "R": rotWay(ship, -qty); break;
    default: throw new Error(action);
  }
  console.log(instr, ship);
}

const moveForInstructions = (ship, instructions) => {
  instructions.forEach((instr) => {moveForEach(ship, instr)});
}

const run = () => {
  let st = readStringArrayFromFile("./input/day12.txt", "\n");
  
  let ship = {
    x: 0,
    y: 0,
    way: {
      x: 10,
      y: 1
    }
  }

  moveForInstructions(ship, st);

  console.log(`${taxiDist(ship)}`);
  // not 79740
  // not 79658
  // not 58751
}

module.exports = { run };
