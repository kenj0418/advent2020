const {readStringArrayFromFile, sum} = require("./lib");

const simpleOrderOfOperationsNextOperator = (tokens) => {
  return tokens.length - 2;
}

const addSubFirstOrderOfOperationsNextOperator = (tokens) => {
  const lastMul = tokens.lastIndexOf("*");
  const lastDiv = tokens.lastIndexOf("/");
  if (lastMul < 0 && lastDiv < 0) {
    return tokens.length - 2;
  } else if (lastMul < 0) {
    return lastDiv;
  } else if (lastMul > lastDiv) {
    return lastMul;
  } else {
    return lastDiv;
  }
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

const procesAllParens = (tokens, orderOfOperations) => {
  let newTokens = []
  let pos = 0;
  while (pos < tokens.length) {
    if (tokens[pos] == "(") {
      const endPos = pos + getEndParenPos(tokens.slice(pos));
      const parenValue = evaluateTokens(tokens.slice(pos + 1, endPos), orderOfOperations);
      newTokens.push(parenValue)
      pos = endPos + 1;
    } else {
      newTokens.push(tokens[pos]);
      pos++;
    }
  }

  return newTokens;
}

const evaluateTokens = (origTokens, orderOfOperations) => {
  const tokens = procesAllParens(origTokens, orderOfOperations)
  if (tokens.length == 1) {
    return parseInt(tokens[0]);
  } else if (!tokens.length) {
    console.log(`Tokens: ${tokens}`);
    throw new Error("parsing error");
  }

  const operatorIndex = orderOfOperations(tokens);

  const operator = tokens[operatorIndex];
  const lhs = evaluateTokens(tokens.slice(0, operatorIndex), orderOfOperations);
  const rhs = evaluateTokens(tokens.slice(operatorIndex + 1), orderOfOperations);

  switch (operator) {
    case '+': return lhs + rhs;
    case '-': return lhs - rhs;
    case '/': return lhs / rhs;
    case '*': return lhs * rhs;
    default:
      console.log(`Unknown operator: ${tokens}`);
      throw new Error("Unknown operator: " + operator);
  }
}

const evaluate = (st, orderOfOperations) => {
  const tokens = st.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ");
  return evaluateTokens(tokens, orderOfOperations);
}

const run = () => {
  let st = readStringArrayFromFile("./input/day18.txt", "\n");

  const values = st.map((expr) => {return evaluate(expr, simpleOrderOfOperationsNextOperator)});
  const answer = sum(values);
  console.log("ANSWER (Part 1):", answer);

  const values2 = st.map((expr) => {return evaluate(expr, addSubFirstOrderOfOperationsNextOperator)});
  const answer2 = sum(values2);
  console.log("ANSWER (Part 2):", answer2);
}

module.exports = { run };
