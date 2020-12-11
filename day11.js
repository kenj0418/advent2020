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

const basicSeatRules = (map, x, y) => {
  const adjCount = getAdjacentCount(map, x, y);
  const currValue = getValue(map, x, y);
  if (currValue == "L" && adjCount == 0) {
    return "#";
  } else if (currValue == "#" && adjCount >= 4) {
    return "L";
  } else {
    return currValue;
  }
}

const firstVisibleSeatSeatRules = (map, x, y) => {
  const adjCount = getVisibleCount(map, x, y);
  const currValue = getValue(map, x, y);
  if (currValue == "L" && adjCount == 0) {
    return "#";
  } else if (currValue == "#" && adjCount >= 5) {
    return "L";
  } else {
    return currValue;
  }
}

const applySeatRules = (map, seatRules) => {
  const afterMap = [];

  for (let lineNum = 0; lineNum < map.length; lineNum++) {
    let line = "";
    for (let charNum = 0; charNum < map[lineNum].length; charNum++) {
      line += seatRules(map, charNum, lineNum);
    }
    afterMap.push(line);
  }

  return afterMap;
}

const different = (map1, map2) => {
  return map1.join("") != map2.join("");
}

const applyUntilStable = (initialMap, seatRules) => {
  let prevMap = initialMap;
  let map = applySeatRules(prevMap, seatRules);

  while (different(map, prevMap)) {
    // console.log("");
    // console.log(map);
    // console.log("");
    prevMap = map;
    map = applySeatRules(prevMap, seatRules);
  }

  return map;
}

const getSeatedCount = (map) => {
  return map.join("").split("").filter((ch) => {return ch == "#"}).length;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day11.txt", "\n");
  
  const finalMap = applyUntilStable(st, basicSeatRules);
  console.log(`Day 11 part 1:  ${getSeatedCount(finalMap)}`);

  const finalMap2 = applyUntilStable(st, firstVisibleSeatSeatRules);
  console.log(`Day 11 part 2:  ${getSeatedCount(finalMap2)}`);
}

module.exports = { run };
