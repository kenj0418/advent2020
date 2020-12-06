const {readStringArrayFromFile, sum} = require("./lib");

const parseLine = (line) => {
  let responses = {}
  const parts = line.split("");
  parts.forEach((part) => {responses[part] = true});
  return responses;
}

const parseGroups = (lines) => {
  let groups = [];
  let currGroup = {}
  lines.forEach(line => {
    if (line.length > 0) {
      const newData = parseLine(line);
      currGroup = {...currGroup, ...newData}
    } else {
      groups.push(currGroup);
      currGroup = {};
    }
  })
  if (currGroup != {}) {
    groups.push(currGroup);
  }

  return groups;
}

const parseGroups2 = (lines) => {
  let groups = [];
  let currGroup = {num: 0}
  lines.forEach(line => {
    if (line.length > 0) {
      const newData = parseLine(line);
      currGroup.num++;
      Object.getOwnPropertyNames(newData).forEach((resp) => {
        if (currGroup[resp]) {
          currGroup[resp]++
        } else {
          currGroup[resp] = 1
        }
      });
    } else {
      groups.push(currGroup);
      currGroup = {num: 0};
    }
  })

  if (currGroup != {}) {
    groups.push(currGroup);
  }

  return groups;
}

const getYesCount = (group) => {
  return Object.getOwnPropertyNames(group).length;
}

const summarizeAnswers = (group) => {
  let summary = {num: 0}

  group.forEach((mem) => {
    summary.num++;
    Object.getOwnPropertyNames(mem).forEach((resp) => {
      if (summary[resp]) {
        summary[resp]++
      } else {
        summary[resp] = 1
      }
    });
  })
}

const getAllYesCount = (group) => {
  let yesCount = 0;

  Object.getOwnPropertyNames(group).forEach((resp) => {
    if (resp == "num") {
      //
    } else if (group[resp] == group.num) {
      yesCount++
    }
  });

  return yesCount;
}

const run = () => {
  const st = readStringArrayFromFile("./input/day6.txt", "\n")
  // const groups = parseGroups(st);
  // const yesCounts = groups.map(getYesCount);

  const groups = parseGroups2(st);
  const allYesCounts = groups.map(getAllYesCount);

  console.log(`Day 6:  ${sum(allYesCounts)}`);
}

module.exports = { run };