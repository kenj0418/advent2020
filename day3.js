const {readStringArrayFromFile} = require("./lib");

const findForSlope = (st, xDelta, yDelta) => {
  let treeCount = 0;
  let y = 0;
  let x = 0;
  while (y < st.length) {
    const currRow = st[y];
    const currPos = currRow[x % currRow.length];
    if (currPos == "#") {
      treeCount++
    }
    y += yDelta;
    x += xDelta;
  }

  return treeCount;
}

const run = () => {
  const st = readStringArrayFromFile("./input/day3.txt", "\n");
  console.log(`Part 1: ${findForSlope(st, 3,1)}`);
  console.log(`Part 2: ${findForSlope(st, 1,1) * findForSlope(st, 3,1) * findForSlope(st, 5, 1) * findForSlope(st, 7,1) * findForSlope(st, 1,2)}`);
}

module.exports = { run };