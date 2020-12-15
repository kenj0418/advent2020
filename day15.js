const {readArrayFromFile} = require("./lib");

const takeTurnSlow = (numsSpoken, inputNums, turn) => {
  if (inputNums.length) {
    numsSpoken[turn] = inputNums.shift();
  } else {
    const prevNum = numsSpoken[turn - 1];
    const mostRecentTurn = numsSpoken.slice(0, numsSpoken.length - 1).lastIndexOf(prevNum);
    if (mostRecentTurn == -1) {
      numsSpoken[turn] = 0;
    } else {
      numsSpoken[turn] = turn - mostRecentTurn - 1;
    }
  }

  // console.log(`Turn ${turn + 1}: ${numsSpoken[turn]}`);
}

const addNum = (prevValues, values, newValue, turn) => {
  // console.log(`Turn ${turn}: ${newValue}`);
  prevValues[newValue] = values[newValue];
  values[newValue] = turn + 1;
}

const getTurn = (inputNums, turn) => {
  let prevValues = new Array(30000001)
  let values = new Array(30000001)
  let i = 0;
  let prevNum
  while (inputNums.length) {
    prevNum = inputNums.shift();
    addNum(prevValues, values, prevNum, i);
    i++
  }

  while (i < turn) {
    if (i % 1048576 == 0) {
      console.log(`Turn ${i}`);
    }
    const lastSeen = prevValues[prevNum];
    if (lastSeen == undefined) {
      // console.log(`Never saw a ${prevNum} before`);
      prevNum = 0;
    } else {
      // console.log(`Saw a ${prevNum} on turn ${lastSeen}`);
      prevNum = i - lastSeen
    }

    addNum(prevValues, values, prevNum, i);
    i++;
  }

  return prevNum;
}

const run = () => {
  let inputNums = readArrayFromFile("./input/day15.txt", ",");
  // let numsSpoken = []
  // for (let turn = 0; turn < 2020; turn++) {
  //   takeTurnSlow(numsSpoken, inputNums, turn);
  // }

  // console.log(numsSpoken[2019]);

  const answer = getTurn(inputNums, 30000000);
  console.log(answer);
}

module.exports = { run };
