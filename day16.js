const {readArrayFromFile} = require("./lib");

const run = () => {
  let inputNums = readArrayFromFile("./input/day15.txt", ",");

  const answer = 0;
  console.log(answer);
}

module.exports = { run };
