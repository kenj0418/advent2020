const {readStringArrayFromFile} = require("./lib");

const rotate = (grid) => {
  let newGrid = [];

  if (!grid || !grid[0]) {
    // console.log(`grid: ${JSON.stringify(grid)}`);
  }

  for (let colNum = grid[0].length - 1; colNum >= 0; colNum--) {
    let newLine = "";
    for (let rowNum = 0; rowNum < grid.length; rowNum++) {
      newLine += grid[rowNum].charAt(colNum);
    }
    newGrid.push(newLine);
  }

  return newGrid;
}

const flip = (lines) => {
  return lines.map((st) => {
    return st.split("").reverse().join("");
  })
}

const processGrids = (grid) => {
  return {
    layout: grid,
    left: getLeft(grid),
    right: getRight(grid),
    top: getTop(grid),
    bottom: getBottom(grid)
  }
}

const parseTile = (st) => {
  const lines = st.split("\n");
  const id = parseInt(lines[0].match(/Tile ([0-9]*)\:/)[1]);
  const zero = lines.slice(1);
  const one = rotate(zero);
  const two = rotate(one);
  const three = rotate(two);
  const flipZero = flip(zero);
  const flipOne = rotate(flipZero)
  const flipTwo = rotate(flipOne);
  const flipThree = rotate(flipTwo);

  const rawGrids = [zero, one, two, three, flipZero, flipOne, flipTwo, flipThree]
  const grids = rawGrids.map(processGrids);

  return {
    id,
    grids
  }
}

const getLeft = (grid) => {
  console.log(grid);
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

const processTileLookup = (tiles) => {
  let lefts = {};
  let rights = {};
  let tops = {};
  let bottoms = {}
  tiles.forEach(tile => {
    console.log("TILE", tile);
    tile.grids.forEach((grid) => {
      const currTile = {
        id: tile.id,
        grids: [grid]
      };
      lefts[getLeft(grid)] = currTile;
      rights[getRight(grid)] = currTile;
      tops[getTop(grid)] = currTile;
      bottoms[getBottom(grid)] = currTile;
    })
  })

  return {
    lefts, rights, tops, bottoms
  }
}

const fitsWith = (arrangement, x, y, grid, dir) => {
  // console.log(`checking ${x}, ${y}`);
  if (x < 0 || y < 0 || y >= arrangement.length || x >= arrangement.length) return true;

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

  // if (gridSt != targetSt) {
  //   console.log(`Comparing DIR ${dir}, gridSt:${gridSt}, targetSt:${targetSt} NOT EQUAL`);
  // }
  return gridSt == targetSt;
}

const canFit = (arrangement, grid, x, y) => {
  const result = fitsWith(arrangement, x - 1, y, grid, "L") &&
    fitsWith(arrangement, x + 1, y, grid, "R") &&
    fitsWith(arrangement, x, y - 1, grid, "U") &&
    fitsWith(arrangement, x, y + 1, grid, "D");
  return result;
}

const copyArrangement = (arr) => {
  let newArr = new Array(arr.length);
  for (let y = 0; y < arr.length; y++) {
    newArr[y] = new Array(arr.length);
    for (let x = 0; x < arr.length; x++) {
      newArr[y][x] = arr[y][x];
    }
  }
  return newArr;
}

const placeAt = (arrangement, tile, x, y, rotationNum) => {
  // console.log(`trying ${tile.id} at ${x},${y}, rotationNum=${rotationNum}`)
  if (canFit(arrangement, tile.grids[rotationNum], x, y)) {
    const newTile = {
      id: tile.id,
      grids: [tile.grids[rotationNum]]
    }

    let newArrangement = copyArrangement(arrangement);
    newArrangement[y][x] = newTile;
    // console.log(`trying ${tile.id} at ${x},${y} FIT}`)
    return newArrangement;
  }

  // console.log(`trying ${tile.id} at ${x},${y} DID NOT FIT`)
  return null;
}

const findArrangement = (tiles, arrangement) => {
  console.log(`findArrangement(#${tiles.length}, #${arrangement.length})`);
  if (tiles.length == 0) {
    return arrangement;
  }

  const nextTile = tiles[0];
  const remainingTiles = tiles.slice(1);

  for (let x = 0; x < arrangement.length; x++) {
    for (let y = 0; y < arrangement.length; y++) {
      if (!arrangement[y][x]) {
        for (let rotationNum = 0; rotationNum < nextTile.grids.length; rotationNum++) {
          const newArrangement = placeAt(arrangement, nextTile, x, y, rotationNum);
          if (newArrangement) {
            // dumpLayout(newArrangement);
            const finalArrangement = findArrangement(remainingTiles, newArrangement);
            if (finalArrangement) {
              return finalArrangement
            }
          }
        }
      }
    }
  }

  // dumpLayout(arrangement);
  // console.log(`Could not place ${nextTile.id} with ${remainingTiles.length} left`);
  
  return null; // did not find one
}

const getScore = (arranged) => {
  const last  = arranged.length - 1;
  return arranged[0][0].id * arranged[0][last].id * arranged[last][0].id * arranged[last][last].id;
}

const initArray = (size) => {
  let arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }
  return arr;
}

const debugging = (tiles) => {
  const t2311 = tiles[0];
  const t1951 = tiles[1];
  const t1171 = tiles[2];
  const t1427 = tiles[3];
  const t1489 = tiles[4];
  const t2473 = tiles[5];
  const t2971 = tiles[6];
  const t2729 = tiles[7];
  const t3079 = tiles[8];


  return [t1951, t2311, t3079,
    t2729, t1427, t2473,
    t2971
  ];

    return [t1951, t2311,  t3079,
    t2729, t1427, t2473,
    t2971, t1489, t1171];
  // 1951    2311    3079
  // 2729    1427    2473
  // 2971    1489    1171


}

const dumpLayout = (arrangement) => {
  console.log("************")
  arrangement.forEach(line => {
    let st = ""
    line.forEach(tile => {
      st += `${tile ? tile.id : "XXXX"}\t`;
    })
    console.log(st);
  })
  console.log("************")
}

const testing = (tiles) => {
  const t2311 = tiles[0];
  const t1951 = tiles[1];
  const t1171 = tiles[2];
  const t1427 = tiles[3];
  const t1489 = tiles[4];
  const t2473 = tiles[5];
  const t2971 = tiles[6];
  const t2729 = tiles[7];
  const t3079 = tiles[8];

  const a = t1951.grids[6];
  const b = t2311.grids[6];
  console.log(a);
  console.log(b);
  // const a = placeAt
}

const run = () => {
  let st = readStringArrayFromFile("./input/day20.txt", "\n\n");
  const tiles = st.map(parseTile);
  const tileLookup = processTileLookup(tiles);

  console.log(tileLookup);
  return;
  testing(tiles);
  return;

  const size = Math.ceil(Math.sqrt(tiles.length));
  console.log(`size: ${size}, num tiles: ${tiles.length}`);
  
  const arranged = findArrangement(tiles, initArray(size));
  if (!arranged) {
    throw new Error("FAILED");
  }

  dumpLayout(arranged);
  const score = getScore(arranged);

  console.log("ANSWER (Part 1):", score);
}

module.exports = { run };
