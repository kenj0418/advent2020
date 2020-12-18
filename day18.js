const {readStringArrayFromFile, sum} = require("./lib");

const processParens = (tokens) => {
  // console.log(`Process Parens ${tokens}`);
  let closeParenCount = 1;
  let pos = tokens.length - 2;
  while (closeParenCount && pos >= 0) {
    if (tokens[pos] == "(") {
      closeParenCount--;
      // console.log("OPEN");
    } else if (tokens[pos] == ")") {
      closeParenCount++;
      // console.log("CLOSE");
    }
    pos--;
  }

  if (closeParenCount) {
    throw new Error("Open Paren " + JSON.stringify(tokens));
  }

  const parenPart = evaluateTokens(tokens.slice(pos + 2, tokens.length - 1));
  const returnArray = [...tokens.slice(0, pos + 1), parenPart];
  // console.log(`Return Array: ${returnArray}`);
  return returnArray;
}

const evaluateTokens = (origTokens) => {
  // console.log(`eval ${origTokens}`);
  let tokens = origTokens;
  if (tokens.length == 1) {
    return parseInt(tokens[0]);
  } else if (!tokens.length) {
    console.log(`Tokens: ${tokens}`);
    throw new Error("parsing error");
  }

  if (tokens[tokens.length - 1] == ")") {
    tokens = processParens(tokens);
    if (tokens.length == 1) {
      return parseInt(tokens[0]);
    }
  }

  const lastOperatorIndex = tokens.length - 2; // since already handling parens
  const lastOperator = tokens[lastOperatorIndex];
  const lhs = evaluateTokens(tokens.slice(0, lastOperatorIndex));
  const rhs = evaluateTokens(tokens.slice(lastOperatorIndex + 1));

  switch (lastOperator) {
    case '+': return lhs + rhs;
    case '-': return lhs - rhs;
    case '/': return lhs / rhs;
    case '*': return lhs * rhs;
    default:
      console.log(`Unknown operator: ${tokens}`);
      throw new Error("Unknown operator: " + firstOperator);
  }
}

const evaluate = (st) => {
  const tokens = st.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ");
  return evaluateTokens(tokens);
}

const getEndParenPos = (tokens) => {
  let pos = 1;
  let  openCount = 1;
  while (openCount && pos < tokens.length) {
    if (tokens[pos] == "(") {
      openCount++;
    } else if (tokens[pos] == ")") {
      openCount--;
    }
    pos++;
  }

  if (openCount) {
    console.log(`openCount = ${openCount}, tokens: ${tokens}`);
    throw new Error("paren mismatch");
  }

  return pos - 1;
}

const procesAllParens2 = (tokens) => {
  let newTokens = []
  let pos = 0;
  while (pos < tokens.length) {
    if (tokens[pos] == "(") {
      const endPos = pos + getEndParenPos(tokens.slice(pos));
      const parenValue = evaluateTokens2(tokens.slice(pos + 1, endPos));
      newTokens.push(parenValue)
      pos = endPos + 1;
    } else {
      newTokens.push(tokens[pos]);
      pos++;
    }
  }

  return newTokens;
}

const getLastMulDiv = (tokens) => {
  const lastMul = tokens.lastIndexOf("*");
  const lastDiv = tokens.lastIndexOf("/");
  if (lastMul < 0) {
    return lastDiv;
  } else if (lastDiv < 0) {
    return lastMul;
  } else if (lastMul > lastDiv) {
    return lastMul;
  } else {
    return lastDiv;
  }
}

const evaluateTokens2 = (origTokens) => {
  console.log(`eval ${origTokens}`);
  const tokens = procesAllParens2(origTokens)
  if (tokens.length == 1) {
    return parseInt(tokens[0]);
  } else if (!tokens.length) {
    console.log(`Tokens: ${tokens}`);
    throw new Error("parsing error");
  }

  const mulDivPos = getLastMulDiv(tokens);
  const operatorIndex = (mulDivPos >= 0) ? mulDivPos : tokens.length - 2;

  const operator = tokens[operatorIndex];
  console.log(operator);
  console.log(`lhs: ${tokens.slice(0, operatorIndex)}`);
  const lhs = evaluateTokens2(tokens.slice(0, operatorIndex));
  console.log(`rhs: ${tokens.slice(operatorIndex + 1)}`);
  const rhs = evaluateTokens2(tokens.slice(operatorIndex + 1));

  switch (operator) {
    case '+': console.log(`returns: ${lhs + rhs}`); return lhs + rhs;
    case '-': console.log(`returns: ${lhs - rhs}`); return lhs - rhs;
    case '/': console.log(`returns: ${lhs / rhs}`); return lhs / rhs;
    case '*': console.log(`returns: ${lhs * rhs}`); return lhs * rhs;
    default:
      console.log(`Unknown operator: ${tokens}`);
      throw new Error("Unknown operator: " + operator);
  }
}

const evaluate2 = (st) => {
  const tokens = st.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ");
  return evaluateTokens2(tokens);
}

const run = () => {
  let st = readStringArrayFromFile("./input/day18.txt", "\n");

  const values = st.map(evaluate);
  const answer = sum(values);
  console.log("ANSWER (Part 1):", answer);

  const values2 = st.map(evaluate2);
  // console.log(values2);
  const answer2 = sum(values2);
  console.log("ANSWER (Part 2):", answer2);
}

module.exports = { run };
