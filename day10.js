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
    console.log(`adding ${thisChoice} for ${choice}`);
    numChoices += thisChoice;
  })

  if (start + 3 >= end) {
    console.log(`adding 1 or reaching end from here`);
    numChoices++;
  }

  return numChoices;    
}


const findArrangements = (start, end, nums) => {
  if (!cache[start] && cache[start] != 0) {
    cache[start] = rawFindArrangements(start, end, nums);
    // console.log(`${start}, ${end} ==> ${cache[start]}`);
  } else {
    // console.log(`cache: ${start}, ${end}  ==> ${cache[start]}`);
  }
  return cache[start];
}


const run = () => {
  let nums = readArrayFromFile("./input/day10.txt", "\n");
  nums.push(0);
  nums.sort((a,b) => {return a - b});

  // nums.push(Math.max(...nums) + 3);
  // const oneStep = nums.filter((num, i) => {return i && (num - nums[i - 1] == 1)});
  // const threeStep = nums.filter((num, i) => {return i && (num - nums[i - 1] == 3)});
  // console.log(`Day 10 part 1:  ${oneStep.length * threeStep.length}`);

  const numArrangements = findArrangements(0, Math.max(...nums) + 3, nums);
  console.log(`Day 10 part 2:  ${numArrangements}`);
}


// 2 is not: 42134492139787170000
// 2 is not: 10661358011223638000
module.exports = { run };



// 8: 1  (1 way to get 4)
// 8: 4  (can go to 5, 6, or 7)
// 4: 5  (can go to 6 or 7)
// 2: 6 
// 2: 7 

// 2: 10 (can go to 11 or 12)
// 1: 11

// 1: 12 12 15 16 19
