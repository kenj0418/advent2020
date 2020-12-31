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

const getAdjacentValue = (tiles, pos, dir) => {
  const adjPos = move(pos, dir);
  return (tiles[getKey(adjPos)]) ? 1 : 0
}

const countAdjacentBlack = (tiles, pos) => {
  return getAdjacentValue(tiles, pos, "w") +
    getAdjacentValue(tiles, pos, "e") +
    getAdjacentValue(tiles, pos, "nw") +
    getAdjacentValue(tiles, pos, "ne") +
    getAdjacentValue(tiles, pos, "sw") +
    getAdjacentValue(tiles, pos, "se");
}

const getKeys = (tiles) => {
  return Object.getOwnPropertyNames(tiles);
}

const getXValues = (tiles) => {
  return getKeys(tiles).map(tile => {return tile.split(":")[0]});
}

const getYValues = (tiles) => {
  return getKeys(tiles).map(tile => {return tile.split(":")[1]});
}

const tileLife = (tiles) => {
  const newTiles = {}
  const xValues = getXValues(tiles);
  const yValues = getYValues(tiles);
  let minX = Math.min(...xValues);
  let minY = Math.min(...yValues);
  let maxX = Math.max(...xValues);
  let maxY = Math.max(...yValues);

  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      const posKey = getKey({x,y});
      const adjCount = countAdjacentBlack(tiles, {x,y});
      // console.log(`adjCount @ ${posKey} : ${adjCount}`);
      if (tiles[posKey]) {
        if (adjCount == 1 || adjCount == 2) {
          newTiles[posKey] = true;
        }
      } else {
        if (adjCount == 2) {
          newTiles[posKey] = true;
        }
      }
    }
  }

  return newTiles;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day24.txt", "\n");
  let allInstructions = st.map(parseInstructionLine);
  let tiles = {}
  processAllInstructions(tiles, allInstructions)
  console.log("ANSWER (part 1) :", countBlack(tiles));

  // console.log(tiles);
  for (let i = 1; i <= 100; i++) {
    tiles = tileLife(tiles);
    // console.log(tiles);
  }
  console.log("ANSWER (part 2) :", countBlack(tiles));
}

module.exports = { run };
