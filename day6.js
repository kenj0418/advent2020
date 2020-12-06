const {readStringArrayFromFile, parseRecords, sum} = require("./lib");

const parseGroupsPart1 = (lines) => {
  const initialGroupFunc = () => {return {}};
  const groupAccumulator = (currGroup, line) => {
    const parts = line.split("");
    parts.forEach((part) => {currGroup[part] = true});
  };

  return parseRecords(lines, initialGroupFunc, groupAccumulator);
}

const parseGroupsPart2 = (lines) => {
  const initialGroupFunc = () => {return {num: 0}};
  const groupAccumulator = (currGroup, line) => {
    currGroup.num++;

    const parts = line.split("");
    parts.forEach((part) => {
      if (currGroup[part]) {
        currGroup[part]++
      } else {
        currGroup[part] = 1
      }
    });
  };

  return parseRecords(lines, initialGroupFunc, groupAccumulator);
}

const getYesCount = (group) => {
  return Object.getOwnPropertyNames(group).length;
}

const getAllYesCount = (group) => {
  return Object.getOwnPropertyNames(group).filter((resp) => {
    return (resp != "num" && group[resp] == group.num)
  }).length;
}

const run = () => {
  const st = readStringArrayFromFile("./input/day6.txt", "\n")

  const groupsPart1 = parseGroupsPart1(st);
  const yesCounts = groupsPart1.map(getYesCount);

  const groups = parseGroupsPart2(st);
  const allYesCounts = groups.map(getAllYesCount);

  console.log(`Day 6 part 1:  ${sum(yesCounts)}`);
  console.log(`Day 6 part 2:  ${sum(allYesCounts)}`);
}

module.exports = { run };