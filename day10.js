const {readArrayFromFile} = require("./lib");

let cache = [];

const rawFindArrangements = (start, end, nums) => {
  const filteredNums = nums.filter((num) => {return num > start});
  if (nums.length == 1 && nums[0] == end) {
    return 1;
  }

  const validChoices = filteredNums.filter((num) => {return num <= start + 3;});
  let numChoices = 0;
  validChoices.forEach((choice) => {
    const thisChoice = findArrangements(choice, end, nums);
    numChoices += thisChoice;
  })

  if (start + 3 >= end) {
    numChoices++;
  }

  return numChoices;    
}

const findArrangements = (start, end, nums) => {
  if (!cache[start] && cache[start] != 0) {
    cache[start] = rawFindArrangements(start, end, nums);
  }
  return cache[start];
}

const getPart1Value = (initialNums) => {
  let nums = [...initialNums];
  nums.push(Math.max(...nums) + 3);
  const oneStep = nums.filter((num, i) => {return i && (num - nums[i - 1] == 1)});
  const threeStep = nums.filter((num, i) => {return i && (num - nums[i - 1] == 3)});
  return oneStep.length * threeStep.length;
}

const run = () => {
  let nums = readArrayFromFile("./input/day10.txt", "\n");
  nums.push(0);
  nums.sort((a,b) => {return a - b});

  console.log(`Day 10 part 1:  ${getPart1Value(nums)}`);

  const numArrangements = findArrangements(0, Math.max(...nums) + 3, nums);
  console.log(`Day 10 part 2:  ${numArrangements}`);
}

module.exports = { run };
