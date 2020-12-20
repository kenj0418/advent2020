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

const parseGrid = (zero) => {
  const one = rotate(zero);
  const two = rotate(one);
  const three = rotate(two);
  const flipZero = flip(zero);
  const flipOne = rotate(flipZero)
  const flipTwo = rotate(flipOne);
  const flipThree = rotate(flipTwo);

  return [zero, one, two, three, flipZero, flipOne, flipTwo, flipThree]
}

const parseTile = (st) => {
  const lines = st.split("\n");
  const id = parseInt(lines[0].match(/Tile ([0-9]*)\:/)[1]);
  const rawGrids = parseGrid(lines.slice(1));
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
  if (numTiles <= tilesUsed.length) {
    return arrangementSoFar;
  }

  const y = Math.floor(tilesUsed.length / arrangementSoFar.length);
  const x = tilesUsed.length % arrangementSoFar.length;

  const tileAbove = getTileAt(arrangementSoFar, x , y-1);
  const tileLeft = getTileAt(arrangementSoFar, x-1, y);

  const matchingLeft = tileLeft && tileLookup.lefts[tileLeft.grids[0].right];
  const matchingAbove = tileAbove && tileLookup.tops[tileAbove.grids[0].bottom];

  let matches = findMatches(matchingLeft, matchingAbove, tilesUsed);
  for (let matchNum = 0; matchNum < matches.length; matchNum++) {
    let newArrangement = copyArrangement(arrangementSoFar);
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

const constructMap = (arranged) =>  {
  let arr = [];
  for (let arrRowNum = 0; arrRowNum < arranged.length; arrRowNum++) {
    const arrRow = arranged[arrRowNum];
    const textWidth = arrRow[0].grids[0].layout.length
    for (let gridRowNum = 1; gridRowNum < textWidth -1; gridRowNum++) {
      let line = "";
      for (let arrColNum = 0; arrColNum < arrRow.length; arrColNum++) {
        const gridLine = arrRow[arrColNum].grids[0].layout[gridRowNum];
        line += gridLine.slice(1, gridLine.length - 1);
      }
      arr.push(line);
    }
  }
  return arr;
}

const isMonsterAt = (map, monster, x, y) => {
  for (let monsterY = 0; monsterY < monster.length; monsterY++) {
    for (let monsterX = 0; monsterX < monster[monsterY].length; monsterX++) {
      if (monster[monsterY][monsterX] == "#" && map[y + monsterY][x + monsterX] != "#") {
        return false;
      }
    }
  }

  return true;
}

const removeMonsterAt = (map, monster, x, y) => {
  console.log(`Removing monster at ${x}, ${y}`);
  let currMap = JSON.parse(JSON.stringify(map));

  for (let monsterY = 0; monsterY < monster.length; monsterY++) {
    for (let monsterX = 0; monsterX < monster[monsterY].length; monsterX++) {
      if (monster[monsterY].charAt(monsterX) == "#") {
        let currRow = currMap[y + monsterY];
        currRow = currRow.slice(0, x + monsterX) + "O" + currRow.slice(x + monsterX + 1);
        currMap[y + monsterY] = currRow;
      }
    }
  }

  return currMap;
}

const removeMonster = (map, monster) => {
  let currMap = JSON.parse(JSON.stringify(map));
  for (let y = 0; y <= map.length - monster.length; y++) {
    for (let x = 0; x <= map[y].length - monster[0].length; x++) {
      if (isMonsterAt(map, monster, x, y)) {
        currMap = removeMonsterAt(currMap, monster, x, y);
      }
    }
  }

  return currMap;
}

const removeMonsters = (map, monsters) => {
  let currMap = JSON.parse(JSON.stringify(map));
  for (let monsterNum = 0; monsterNum < monsters.length; monsterNum++) {
    currMap = removeMonster(currMap, monsters[monsterNum]);
  }

  return currMap;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day20.txt", "\n\n");
  const tiles = st.map(parseTile);
  const tileLookup = processTileLookup(tiles);
 
  const arranged = findArrangement(tileLookup, tiles);
  if (!arranged) {
    throw new Error("FAILED");
  }

  const score = getScore(arranged);
  console.log("ANSWER (Part 1):", score);

  const monsters = parseGrid(readStringArrayFromFile("./input/day20monster.txt", "\n"));
  const map = constructMap(arranged);
  const mapRemain = removeMonsters(map, monsters);
  const roughness = mapRemain.join("").replace(/[O.]/g,"").length;
  console.log("ANSWER (Part 2):", roughness);
}

module.exports = { run };
