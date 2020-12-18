const {readStringArrayFromFile, sum} = require("./lib");

const processParens = (tokens) => {
  console.log(`Process Parens ${tokens}`);
  let closeParenCount = 1;
  let pos = tokens.length - 2;
  while (closeParenCount && pos >= 0) {
    if (tokens[pos] == "(") {
      closeParenCount--;
      console.log("OPEN");
    } else if (tokens[pos] == ")") {
      closeParenCount++;
      console.log("CLOSE");
    }
    pos--;
  }

  if (closeParenCount) {
    throw new Error("Open Paren " + JSON.stringify(tokens));
  }

  const parenPart = evaluateTokens(tokens.slice(pos + 2, tokens.length - 1));
  const returnArray = [...tokens.slice(0, pos + 1), parenPart];
  console.log(`Return Array: ${returnArray}`);
  return returnArray;
}

const evaluateTokens = (origTokens) => {
  console.log(`eval ${origTokens}`);
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

const run = () => {
  let st = readStringArrayFromFile("./input/day18.txt", "\n");

  const values = st.map(evaluate);
  console.log(values);
  const answer = sum(values);
  console.log("ANSWER (Part 1):", answer);
}

module.exports = { run };
