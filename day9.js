const {readArrayFromFile} = require("./lib");

const isValid = (prev, next) => {
  for (let i = 0; i < prev.length; i++) {
    for (let j = i + 1; j < prev.length; j++) {
      if (prev[i] + prev[j] == next) {
        return true;
      }
    }
  }

  return false;
}

const findBadNumber = (prev, rest) => {
  while (rest.length > 0) {
    const next = rest.shift();
    if (isValid(prev, next)) {
      prev.shift();
      prev.push(next);
    } else {
      return next;
    }
  }

  throw new Error("all were good");
}

const findBadCount = (nums, bad, start) => {
  let sum = 0;
  let count = 0;
  while (count + start < nums.length && sum < bad) {
    count++
    sum += nums[start + count];
  }

  if (sum == bad) {
    return count;
  } else {
    return 0;
  }
}

const findBadRange = (nums, bad) => {
  for (let i = 0; i < nums.length; i++) {
    const badCount = findBadCount(nums, bad, i);
    if (badCount) {
      return nums.slice(i, i + badCount);
    }
  }
}

const run = () => {
  const nums = readArrayFromFile("./input/day9.txt", "\n");
  let prev25 = nums.slice(0, 25);
  let rest = nums.slice(25);

  const firstBadNumber = findBadNumber(prev25, rest);
  console.log(`Day 9 part 1:  ${firstBadNumber}`);

  const badRange = findBadRange(nums, firstBadNumber);
  console.log(`Day 9 part 2:  ${Math.min(...badRange) + Math.max(...badRange)}`);
}

module.exports = { run };