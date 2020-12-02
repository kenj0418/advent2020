const {readStringArrayFromFile} = require("./lib");

const countOccur = (st, ch) => {
  return st.split(ch).length - 1;
}

const isValid = (pwd) => {
  const count = countOccur(pwd.password, pwd.policy.char);
  return count >= pwd.policy.min && count <= pwd.policy.max;
}

const isValid2 = (pwd) => {
  return (pwd.password[pwd.policy.min - 1] == pwd.policy.char || pwd.password[pwd.policy.max - 1] == pwd.policy.char)
  && pwd.password[pwd.policy.min - 1] != pwd.password[pwd.policy.max - 1]
}

const parsePwdLine = (line) => {
  const parts = line.split(": ");
  const policyParts = parts[0].split(" ");
  const range = policyParts[0].split("-");
  return {
    policy: {
      min: parseInt(range[0]),
      max: parseInt(range[1]),
      char: policyParts[1]
    },
    password: parts[1]
  }
}

const run = () => {
  const st = readStringArrayFromFile("./input/day2.txt", "\n");
  const pwdLine = st.map(parsePwdLine);
  const valid = pwdLine.filter(isValid2);

  console.log(valid.length);
}

module.exports = { run };