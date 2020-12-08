const {readStringArrayFromFile} = require("./lib");

const parseInstruction = (st) => {
  const parts = st.split(" ");
  return {instr: parts[0], param: parseInt(parts[1])};
}

const doInstr = (computer) => {
  if (computer.IP > computer.prog.length) {
    throw new Error("PAST END")
  }

  const currInst = computer.prog[computer.IP].instr;
  const currParam = computer.prog[computer.IP].param;
  computer.prog[computer.IP] = {instr: "fail", param: 0};

  switch (currInst) {
    case "acc":
      computer.ACC += currParam;
      computer.IP++;
      break;
    case "jmp":
      computer.IP += currParam;
      break;
    case "nop":
      computer.IP++;
      break;
    case "stop":
      computer.STOP = true;
      break;
    case "fail":
      computer.FAIL = true;
      break;
    default:
      throw new Error(currInst);
  }
}

const swapInstr = (computer, addr, newInst) => {
  let newProg = JSON.parse(JSON.stringify(computer.prog));
  newProg[addr].instr = newInst;
  return computer = {
    IP: 0,
    prog: newProg,
    ACC: 0,
    STOP: false,
  };
}

const swap = (computer, addr) => {
  if (computer.prog[addr].instr == "nop") {
    return swapInstr(computer, addr, "jmp")
  } else if (computer.prog[addr].instr == "jmp") {
    return swapInstr(computer, addr, "nop")
  } else {
    return null;
  }
}

const runToStopOrFail = (computer) => {
  while (!computer.STOP && !computer.FAIL) {
    doInstr(computer);
  }
}

const runTillSingleSwap = (computer) => {
  for (let i = 0; i < computer.prog.length - 1; i++) {
    const testComputer = swap(computer, i);
    if (testComputer) {
      runToStopOrFail(testComputer);
      if (testComputer.STOP) {
        return testComputer
      }
    }
  }

  throw new Error("Never found it");
}

const run = () => {
  const st = readStringArrayFromFile("./input/day8.txt", "\n").filter(line => {return line.length});
  let prog = st.map(parseInstruction);
  prog.push({instr:"stop", param:0});

  const computer = {
    IP: 0,
    prog,
    ACC: 0,
    STOP: false,
  };

  const successComputer = runTillSingleSwap(computer);
  console.log(`Day 8 part 2:  ${successComputer.ACC}`);

  // console.log(`Day 8 part 1:  ${computer.ACC}`);
}

module.exports = { run };