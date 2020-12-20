const {readStringArrayFromFile} = require("./lib");

const rotate = (grid) => {
  let newGrid = [];

  for (let colNum = grid[0].length - 1; colNum >= 0; colNum--) {
    let newLine = "";
    for (let rowNum = 0; rowNum < grid.length; rowNum++) {
      newLine += grid[rowNum].charAt(colNum);
    }
    newGrid.push(newLine);
  }

  return newGrid;
}

const parseTile = (st) => {
  const lines = st.split("\n");
  const id = lines[0];
  const zero = lines.slice(1);
  const one = rotate(zero);
  const two = rotate(one);
  const three = rotate(two);

  return {
    id,
    grids: [zero, one, two, three]
  }
}

const getLeft = (grid) => {
  return grid.map(st => {return st[0];}).join("");
}

const getRight = (grid) => {
  return grid.map(st => {return st[st.length - 1];}).join("");
}

const getBottom = (grid) => {
  return grid[grid.length - 1];
}

const getTop = (grid) => {
  return grid[0];
}

const fitsWith = (arrangement, x, y, grid, dir) => {
  // console.log(`checking ${x}, ${y}`);
  if (x < 0 || y < 0 || y >= arrangement.length) return true;

  const target = arrangement[y][x];
  if (!target) return true;
  const targetGrid = target.grids[0];

  // console.log(`Comparing ${target} to ${grid}  dir: ${dir}`);
  switch (dir) {
    case "L":
      gridSt = getLeft(grid);
      targetSt =  getRight(targetGrid);
      break;
    case "R":
      gridSt = getRight(grid);
      targetSt =  getRight(targetGrid);
      break;
    case "U":
      gridSt = getTop(grid);
      targetSt =  getBottom(targetGrid);
      break;
    case "D": 
      gridSt = getBottom(grid);
      targetSt =  getTop(targetGrid);
      break;
  }

  // console.log (`Comparing DIR ${dir}, gridSt:${gridSt}, targetSt:${targetSt}`);
  return gridSt == targetSt;
}

const canFit = (arrangement, grid, y) => {
  // console.log(`canFit @ ${y}`);
  if (y >= arrangement.length) {
    const result = fitsWith(arrangement, 0, y - 1, grid);
    // console.log(`RESULT1: ${result}`);
    return result;
  }

  // if (!arrangement[y]) {
  //   console.log("y", y);
  //   console.log(arrangement);
  // }
  const x = arrangement[y].length;

  const result = fitsWith(arrangement, x - 1, y, grid, "L") &&
    fitsWith(arrangement, x + 1, y, grid, "R") &&
    fitsWith(arrangement, x, y - 1, grid, "U") &&
    fitsWith(arrangement, x, y + 1, grid, "D");
  // console.log(`RESULT2: ${result}`);
  return result;
}

const copyArrangement = (arr) => {
  let newArr = []
  arr.forEach(row => {
    newArr.push([...row]);
  })
  return newArr;
}

const placeAt = (arrangement, tile, y) => {
  // console.log(`placeAt @ ${y}`);
  // console.log(`tile: ${tile.id}`);
  for (let i = 0; i < tile.grids.length; i++) {
    if (canFit(arrangement, tile.grids[i], y)) {
      const newTile = {
        id: tile.id,
        grids: [tile.grids[i]]
      }

      // console.log(`newTile: ${JSON.stringify(newTile)}`);

      let newArrangement = copyArrangement(arrangement);
      // console.log(`New Arrangement1: ${JSON.stringify(newArrangement)}`);
      if (y >= newArrangement.length) {
        newArrangement.push([newTile]);
      } else {
        newArrangement[y].push(newTile);
      }
      // console.log(`New Arrangement2: ${JSON.stringify(newArrangement)}`);
      return newArrangement;
    }
  }

  return null;
}

const findArrangement = (tiles, arrangement) => {
  // console.log(`findArrangemnet(#${tiles.length}, #${arrangement.length})`);
  if (tiles.length == 0) {
    return arrangement;
  }
  for (let tileNum = 0; tileNum < tiles.length; tileNum++) {
    // console.log(`tileNum: ${tileNum}`);
    for (let y = 0; y <= arrangement.length; y++) {
      // console.log(`y: ${y}`);
      const newArrangement = placeAt(arrangement, tiles[tileNum], y);
      if (newArrangement) {
        const newTiles = [...tiles.slice(0, tileNum), ...tiles.slice(tileNum + 1)];
        const finalArrangement = findArrangement(newTiles, newArrangement);
        if (finalArrangement) {
          return finalArrangement
        }
      } else {
        console.log(`Tile # ${tileNum} does not fit at ${y} tiles left: ${tiles.length}`);
      }
    }
  }
  
  return null; // did not find one
}

const getScore = (arranged) => {
  const height = arranged.length;
  const width = arranged[0].length;

  return arranged[0][0].id * arranged[0][width] * arranged[height][0] * arranged[height][width];
}

const run = () => {
  let st = readStringArrayFromFile("./input/day20.txt", "\n\n");
  const tiles = st.map(parseTile);
  const arranged = findArrangement(tiles, []);
  if (!arranged) {
    throw new Error("FAILED");
  }

  console.log(arranged);
  const score = getScore(arranged);

  console.log("ANSWER (Part 1):", score);
}

module.exports = { run };
