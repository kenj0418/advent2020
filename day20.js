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

const addLookup = (arr, key, value) => {
  if (arr[key]) {
    arr[key].push(value);
  } else {
    arr[key] = [value];
  }
}

const processTileLookup = (tiles) => {
  let lefts = {};
  let rights = {};
  let tops = {};
  let bottoms = {}
  tiles.forEach(tile => {
    tile.grids.forEach((grid) => {
      const currTile = {
        id: tile.id,
        grids: [grid]
      };

      addLookup(lefts, grid.left, currTile);
      addLookup(rights, grid.right, currTile);
      addLookup(tops, grid.top, currTile);
      addLookup(bottoms, grid.bottom, currTile);
    })
  })

  return {
    lefts, rights, tops, bottoms
  }
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

const findMatches = (matchingLeft, matchingAbove, tilesUsed) => {
  const notAlreadyUsed = (tile) => {
    return tilesUsed.indexOf(tile.id) < 0;
  };

  if (matchingLeft && matchingAbove) {
    let matchBoth = []
    const aboveIds = matchingAbove.map(tile => {return tile.id});
    matchingLeft.forEach(leftTile => {
      const leftId = leftTile.id;

      if (aboveIds.indexOf(leftId) >= 0 && tilesUsed.indexOf(leftId) < 0) {
        matchBoth.push(leftTile);
      }
    })
    return matchBoth;
  } else if (matchingLeft) {
    return matchingLeft.filter(notAlreadyUsed);
  } else if (matchingAbove) {
    return matchingAbove.filter(notAlreadyUsed);
  } else {
    return []
  }
}

const getTileAt = (arrangement, x, y) => {
  if (!arrangement || !arrangement[y]) {
    return undefined
  } else {
    return arrangement[y][x];
  }
}

const findArrangementPart = (tileLookup, numTiles, arrangementSoFar, tilesUsed) => {
  console.log(`Tiles Used: ${tilesUsed}`);
  if (numTiles <= tilesUsed.length) {
    return arrangementSoFar;
  }

  const y = Math.floor(tilesUsed.length / arrangementSoFar.length);
  const x = tilesUsed.length % arrangementSoFar.length;

  const tileAbove = getTileAt(arrangementSoFar, x , y-1);
  const tileLeft = getTileAt(arrangementSoFar, x-1, y);

  const matchingLeft = tileLeft && tileLookup.lefts[tileLeft.grids[0].right];
  const matchingAbove = tileAbove && tileLookup.tops[tileAbove.grids[0].bottom];

  // console.log(`tileLeft: ${JSON.stringify(tileLeft)}`);
  // console.log(`left lookup: ${tileLeft.grids[0].right}`);
  // console.log(`matchingLeft: ${matchingLeft}`);

  let matches = findMatches(matchingLeft, matchingAbove, tilesUsed);
  // console.log(`Matches: ${matches}`);
  for (let matchNum = 0; matchNum < matches.length; matchNum++) {
    let newArrangement = copyArrangement(arrangementSoFar);
    // console.log(`trying ${matches[matchNum]} @ ${x},${y}`);
    newArrangement[y][x] = matches[matchNum];
    const newTilesUsed = [...tilesUsed, matches[matchNum].id];
    const finalArrangement = findArrangementPart(tileLookup, numTiles, newArrangement, newTilesUsed);
    if (finalArrangement) {
      return finalArrangement
    }
  }
}

const findArrangement = (tileLookup, tiles) => {
  const size = Math.ceil(Math.sqrt(tiles.length));
  let arrangement = initArray(size);

  for (let tileNum = 0; tileNum < tiles.length; tileNum++) {
    const tile = tiles[tileNum];
    for (let gridNum = 0; gridNum < tile.grids.length; gridNum++) {
      console.log(`trying ${tile.id} @ 0,0 with orientation ${gridNum}`);
      arrangement[0][0] = {
        id: tile.id,
        grids: [tile.grids[gridNum]]
      };

      const finalArrangement = findArrangementPart(tileLookup, tiles.length, arrangement, [tile.id]);
      if (finalArrangement) {
        return finalArrangement
      }
    }
  }
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


  return [
    t1951, t2311,
    t2729, t1427
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
 
  const arranged = findArrangement(tileLookup, tiles);
  if (!arranged) {
    throw new Error("FAILED");
  }

  dumpLayout(arranged);
  const score = getScore(arranged);

  console.log("ANSWER (Part 1):", score);
}

module.exports = { run };
