const {sum, readArrayFromFile} = require("./lib");

const run = () => {
  const nums = readArrayFromFile("./input/day1.txt", "\n");
  for (let a = 0; a < nums.length; a++) {
    for (let b = a + 1; b < nums.length; b++) {
      for (let c = b + 1; c < nums.length; c++) {
        if (nums[a] + nums[b] + nums[c] == 2020) {
          console.log(nums[a]*nums[b]*nums[c]);
        }
      }
    }
  }

}

module.exports = { run };