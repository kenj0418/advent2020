const {readStringArrayFromFile} = require("./lib");

const getValue = (map, x, y) => {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return "?";
  return map[y].slice(x, x + 1);
}

const getAdjacentCount = (map, x, y) => {
  const n = (getValue(map, x, y - 1) == "#") ? 1 : 0;
  const ne = (getValue(map, x + 1, y - 1) == "#") ? 1 : 0;
  const nw = (getValue(map, x - 1, y - 1) == "#") ? 1 : 0;
  const s = (getValue(map, x, y + 1) == "#") ? 1 : 0;
  const se = (getValue(map, x + 1, y + 1) == "#") ? 1 : 0;
  const sw = (getValue(map, x - 1, y + 1) == "#") ? 1 : 0;
  const w = (getValue(map, x - 1, y ) == "#") ? 1 : 0;
  const e = (getValue(map, x + 1, y) == "#") ? 1 : 0;
  return n + s + e + w + ne + nw + se + sw;
}

const getVisibleInDirection = (map, x, y, deltaX, deltaY) => {
  let currX = x;
  let currY = y;
  let currValue = "";
  do {
    currX += deltaX;
    currY += deltaY;
    currValue = getValue(map, currX, currY);
  } while (currValue != "#" && currValue != "?" && currValue != "L")

  return currValue == "#" ? 1 : 0;
}

const getVisibleCount = (map, x, y) => {
  const n = getVisibleInDirection(map, x, y, 0, -1)
  const ne = getVisibleInDirection(map, x, y, +1, -1)
  const nw = getVisibleInDirection(map, x, y, -1, -1)
  const s = getVisibleInDirection(map, x, y, 0, +1)
  const se = getVisibleInDirection(map, x, y, +1, +1)
  const sw = getVisibleInDirection(map, x, y, -1, +1)
  const w = getVisibleInDirection(map, x, y, -1, 0)
  const e = getVisibleInDirection(map, x, y, +1, 0)
  return n + s + e + w + ne + nw + se + sw;
}

const applySeatRules = (map) => {
  const afterMap = [];

  for (let lineNum = 0; lineNum < map.length; lineNum++) {
    let line = "";
    for (let charNum = 0; charNum < map[lineNum].length; charNum++) {
      const adjCount = getAdjacentCount(map, charNum, lineNum);
      const currValue = getValue(map, charNum, lineNum);
      if (currValue == "L" && adjCount == 0) {
        line += "#";
      } else if (currValue == "#" && adjCount >= 4) {
        line += "L";
      } else {
        line += currValue;
      }
    }
    afterMap.push(line);
  }

  // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
  // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
  // Otherwise, the seat's state does not change.
  // Floor (.) never changes; seats don't move, and nobody sits on the floor.
  return afterMap;
}

const applySeatRules2 = (map) => {
  const afterMap = [];

  for (let lineNum = 0; lineNum < map.length; lineNum++) {
    let line = "";
    for (let charNum = 0; charNum < map[lineNum].length; charNum++) {
      const adjCount = getVisibleCount(map, charNum, lineNum);
      const currValue = getValue(map, charNum, lineNum);
      if (currValue == "L" && adjCount == 0) {
        line += "#";
      } else if (currValue == "#" && adjCount >= 5) {
        line += "L";
      } else {
        line += currValue;
      }
    }
    afterMap.push(line);
  }

  // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
  // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
  // Otherwise, the seat's state does not change.
  // Floor (.) never changes; seats don't move, and nobody sits on the floor.
  return afterMap;
}

const different = (map1, map2) => {
  return map1.join("") != map2.join("");
}

const applyUntilStable = (initialMap) => {
  let prevMap = initialMap;
  let map = applySeatRules(prevMap);

  while (different(map, prevMap)) {
    // console.log("");
    // console.log(map);
    // console.log("");
    prevMap = map;
    map = applySeatRules(prevMap);
  }

  return map;
}

const applyUntilStable2 = (initialMap) => {
  let prevMap = initialMap;
  let map = applySeatRules(prevMap);

  while (different(map, prevMap)) {
    // console.log("");
    // console.log(map);
    // console.log("");
    prevMap = map;
    map = applySeatRules2(prevMap);
  }

  return map;
}

const getSeatedCount = (map) => {
  return map.join("").split("").filter((ch) => {return ch == "#"}).length;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day11.txt", "\n");
  const finalMap = applyUntilStable(st);
  const seatedCount = getSeatedCount(finalMap);
  
    console.log(`Day 11 part 1:  ${seatedCount}`);

    const finalMap2 = applyUntilStable2(st);
    // console.log(finalMap2);
    const seatedCount2 = getSeatedCount(finalMap2);
    console.log(`Day 11 part 2:  ${seatedCount2}`);
}

module.exports = { run };
