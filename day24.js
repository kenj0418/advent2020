const {readStringArrayFromFile} = require("./lib");

const parseInstructionLine = (st) => {
  let instr = []
  const pattern = /(e|se|sw|w|nw|ne)(.*)/;
  let remaining = st;
  while (remaining.length) {
    const match = remaining.match(pattern);
    if (!match) {
      throw new Error(`Invalid string ${st} at ${remaining}`);
    }
    instr.push(match[1]);
    remaining = match[2];
  }

  return instr;
}

const getDeltaX = (oddRow, dir) => {
  switch (dir) {
    case "w": return -1;
    case "e": return 1;
    case "nw": 
    case "sw": return oddRow ? 0 : -1;
    case "ne": 
    case "se": return oddRow ? 1 : 0;
    default: throw new Error(`Unknown instruction: ${dir}`);
  }
}

const getDeltaY = (dir) => {
  switch (dir) {
    case "w": 
    case "e": return 0;
    case "nw": 
    case "ne": return -1;
    case "sw": 
    case "se": return 1;
    default: throw new Error(`Unknown instruction: ${dir}`);
  }
}

const move = (currentPos, dir) => {
  const oddRow = currentPos.y % 2 != 0;
  const deltaX = getDeltaX(oddRow, dir);
  const deltaY = getDeltaY(dir);
  return {x: currentPos.x + deltaX, y: currentPos.y + deltaY};
}

const getKey = (loc) => {
  return `${loc.x}:${loc.y}`;
}

const flip = (tiles, loc) => {
  const key = getKey(loc);
  if (tiles[key]) {
    delete tiles[key];
  } else {
    tiles[key] = true;
  }
}

const processInstructions = (tiles, instructions) => {
  let currentPos = {x: 0, y: 0};
  for (let i = 0; i < instructions.length; i++) {
    currentPos = move(currentPos, instructions[i]);
    // console.log(`Now at: ${getKey(currentPos)}`);
  }
  flip(tiles, currentPos);
}

const processAllInstructions = (tiles, allInstructions) => {
  for (let i = 0; i < allInstructions.length; i++) {
    processInstructions(tiles, allInstructions[i]);
  }
}

const countBlack = (tiles) => {
  return Object.getOwnPropertyNames(tiles).length;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day24.txt", "\n");
  let allInstructions = st.map(parseInstructionLine);
  let tiles = {}
  processAllInstructions(tiles, allInstructions)
  const numBlack = countBlack(tiles);
  // console.log(tiles);
  console.log("ANSWER (part1) :", numBlack);
}

module.exports = { run };
