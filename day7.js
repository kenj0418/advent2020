const {readStringArrayFromFile} = require("./lib");

const parseRhs = (rhs) => {
  if (rhs == "no other") {
    return null;
  }
  const parts = rhs.match(/([0-9]+) (.+)/);
  if (!parts) throw new Error(rhs);
  return {qty: parseInt(parts[1]), item: parts[2]};
}
const parseRule = (line) => {
  const parts = line.replace(/ bags\.?/g,"").replace(/ bag\.?/g, "").split(" contain ");
  const lhs = parts[0];
  const rhsParts = parts[1].split(", ").map(parseRhs);
  return {lhs, rhs: rhsParts}
}

const getAllColors = (rules) => {
  let colors = new Set();
  rules.forEach((rule) => {
    colors.add(rule.lhs);
    rule.rhs.forEach(rhsPart => {
      if (rhsPart != null) {
        colors.add(rhsPart.item);
      }
    });
  });

  return [...colors];
}

const canReach = (rules, startingColor, targetColor) => {
  // console.log(`canReach(..., ${startingColor}, ${targetColor})`);
  if (startingColor == targetColor) {
    return true;
  }

  const relevantRules = rules.filter((rule) => {return rule.lhs == startingColor});
  for (let ruleNum = 0; ruleNum < relevantRules.length; ruleNum++) {
    const rule = relevantRules[ruleNum];
    for (let rhsPartNum = 0; rhsPartNum < rule.rhs.length; rhsPartNum++) {
      const rhsPart = rule.rhs[rhsPartNum];
      // console.log(rhsPart);
      if (rhsPart != null && rhsPart.qty > 0 && canReach(rules, rhsPart.item, targetColor)) {
        // console.log(`TRUE canReach(..., ${startingColor}, ${targetColor})`);
        return true;
      }
    }
  }

  // console.log(`FALSE canReach(..., ${startingColor}, ${targetColor})`);
  return false;
}

const getBagContentCount = (rules, outerBag, level = 0) => {
  // console.log(`${level} getBagContentCount(..., ${outerBag})`);
  const relevantRule = rules.find(rule => {return rule.lhs == outerBag});
  // console.log(`rule: ${JSON.stringify(relevantRule)}`);
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
  // console.log(JSON.stringify(rules, null,2));

  // const bagColors = getAllColors(rules);
  // console.log(bagColors);

  // const relevantBagColors = bagColors.filter((color) => {
  //   return canReach(rules, color, "shiny gold");
  // });
  
  const bagContents = getBagContentCount(rules, "shiny gold");

  // console.log(`Day 6 part 1:  ${relevantBagColors.length - 1}`);
  console.log(`Day 6 part 2:  ${bagContents}`);
  // console.log(`Day 6 part 2:  ${}`);
}

module.exports = { run };