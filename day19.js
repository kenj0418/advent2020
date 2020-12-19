const {readStringArrayFromFile} = require("./lib");

let cache = {}

//todo could precompute possible lengths for rules

const isMatchOptionRaw = (rules, option, msg) => {
  // console.log(`Checking ${msg} matches ${option}`);
  if (option.length == 0 && msg.length != 0) return false;
  if (option.length > msg.length) return false;
  if (option.length == 0 && msg.length == 0) return true;

  for (let len = 1; len <= msg.length; len++) {
    const startMsg = msg.slice(0, len);
    const endMsg = msg.slice(len);
    const restOfOption = option.slice(1);

    if (isMatch(rules, option[0], startMsg) && isMatchOption(rules, restOfOption, endMsg)) {
      // console.log(`Checking ${msg} matches ${option}: TRUE`);
      return true;
    }
  }

  // console.log(`Checking ${msg} matches ${option}: FALSE`);
  return false;
}

const isMatchOption = (rules, option, msg) => {
  const key = `${JSON.stringify(option)}:${msg}`;
  let cacheValue = cache[key];
  if (cacheValue == undefined) {
    cacheValue = isMatchOptionRaw(rules, option, msg);
    cache[key] = cacheValue;
  }

  return cacheValue;
}

const isMatch = (rules, ruleNum, msg) => {
  const currRule = rules[ruleNum];
  // console.log(`CHECKING ${JSON.stringify(currRule)} against ${msg}`);
  if (currRule.id != ruleNum) {throw new Error("mismatch: " + ruleNum);}

  if (currRule.literal) {
    return currRule.literal == msg;
  }

  for (let optionNum = 0; optionNum < currRule.options.length; optionNum++) {
    const currOption = currRule.options[optionNum];
    if (isMatchOption(rules, currOption, msg)) {
      // console.log(`SUCCESS ${JSON.stringify(currRule)} against ${msg}`);
      return true;
    }
  }

  return false;
}

const parseOption = (optionSt) => {
  return optionSt.split(" ").map(Number);
}

const parseRule = (ruleSt) => {
  const literalMatch = ruleSt.match(/([0-9]*): \"(.*)\"/);
  if (literalMatch) {
    return {
      id: parseInt(literalMatch[1]),
      literal: literalMatch[2],
    }
  }

  const optionMatch = ruleSt.match(/([0-9]*): (.*)/);
  if (!optionMatch) {
    throw new Error("parse error: " + ruleSt);
  }

  const id = parseInt(optionMatch[1]);
  const optionSt = optionMatch[2];
  const options = optionSt.split(" | ").map(parseOption);
  return { id, options }
}

const parseRules = (ruleStArr) => {
  let rules = new Array(ruleStArr.length);

  ruleStArr.forEach(ruleSt => {
    const rule = parseRule(ruleSt);
    rules[rule.id] = rule;
  });

  return rules;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day19.txt", "\n\n");
  let ruleSt = st[0].split("\n");
  let rules = parseRules(ruleSt)
  let msgSt = st[1].split("\n");

  // const matchingMsgs = msgSt.filter((msg) => {
  //   const result = isMatch(rules, 0, msg);
  //   console.log(`${result} ${msg}`);
  //   return result;
  // })
  // console.log("ANSWER (Part 1):", matchingMsgs.length);

  cache = {};

  rules[8] = parseRule("8: 42 | 42 8");
  rules[11] = parseRule("11: 42 31 | 42 11 31");
    
  const matchingMsgs2 = msgSt.filter((msg) => {
    const result = isMatch(rules, 0, msg);
    console.log(`${result} ${msg}`);
    return result;
  })
  console.log("ANSWER (Part 1):", matchingMsgs2.length);
}

module.exports = { run };
