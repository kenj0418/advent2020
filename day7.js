const {readStringArrayFromFile} = require("./lib");

const parseRhs = (rhs) => {
  const parts = rhs.match(/([0-9]+) (.+)/);
  return {qty: parseInt(parts[1]), item: parts[2]};
}

const parseRule = (line) => {
  const parts = line.replace(/ bags?\.?/g,"").split(" contain ");
  const lhs = parts[0];
  if (parts[1] == "no other") {
    return {lhs, rhs: []};
  }

  const rhsParts = parts[1].split(", ").map(parseRhs);
  return {lhs, rhs: rhsParts}
}

const getAllColors = (rules) => {
  let colors = new Set();
  rules.forEach((rule) => {
    colors.add(rule.lhs);
    rule.rhs.forEach(rhsPart => {
      colors.add(rhsPart.item);
    });
  });

  return [...colors];
}

const canReach = (rules, startingColor, targetColor) => {
  if (startingColor == targetColor) {
    return true;
  }

  const rule = rules.find((rule) => {return rule.lhs == startingColor});
  for (let rhsPartNum = 0; rhsPartNum < rule.rhs.length; rhsPartNum++) {
    const rhsPart = rule.rhs[rhsPartNum];
    if (canReach(rules, rhsPart.item, targetColor)) {
      return true;
    }
  }

  return false;
}

const getBagContentCount = (rules, outerBag, level = 0) => {
  const relevantRule = rules.find(rule => {return rule.lhs == outerBag});
  let contentsCount = 0;
  if (!relevantRule) {
    throw new Error(outerBag);
  }
  relevantRule.rhs.forEach(rhsPart => {
    if (rhsPart != null && rhsPart.qty > 0) {
      contentsCount += rhsPart.qty;
      contentsCount += rhsPart.qty * getBagContentCount(rules, rhsPart.item, level + 1);
    }
  })
  
  return contentsCount;

}

const run = () => {
  const st = readStringArrayFromFile("./input/day7.txt", "\n").filter(line => {return line.length});

  const rules = st.map(parseRule);

  const bagColors = getAllColors(rules);
  const relevantBagColors = bagColors.filter((color) => {
    return canReach(rules, color, "shiny gold");
  });
  console.log(`Day 7 part 1:  ${relevantBagColors.length - 1}`);
  
  const bagContents = getBagContentCount(rules, "shiny gold");
  console.log(`Day 7 part 2:  ${bagContents}`);
}

module.exports = { run };