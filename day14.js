const {readStringArrayFromFile, powerSet} = require("./lib");

const parseMask1 = (maskSt) => {
  const orMask = BigInt(`0b${maskSt.replace(/X/g, "0")}`);
  const andMask = BigInt(`0b${maskSt.replace(/X/g, "1")}`);
  return {orMask, andMask};
}

const applyMask1 = (mem, mask, lhs, rhs) => {
  const addr = BigInt(lhs.match(/mem\[([0-9]+)\]/)[1]);
  const value = BigInt(rhs);

  mem[addr] = value & mask.andMask | mask.orMask;  
}

const processCommands1 = (mem, cmds) => {
  let mask = {
    orMask: BigInt(0),
    andMask: BigInt(0)
  };
  cmds.forEach(cmd => {
    const parts = cmd.split(" = ");
    if (parts[0] == "mask") { 
      mask = parseMask1(parts[1]);
    } else {
      applyMask1(mem, mask, parts[0], parts[1]);
    }
  });
}

const getMaskValues = (baseAddr, mask) => {
  const adjustedBaseAddr = BigInt(baseAddr) | mask.orMask;
  let maskValuesRaw = []
  let n = BigInt("0");
  let two = BigInt("2");
  while (two**n < mask.floatMask) {
    if (mask.floatMask & two**n) {
      maskValuesRaw.push(two**n);
    }
    n++
  }

  return powerSet(maskValuesRaw).map(arr => {
    let addr = adjustedBaseAddr;

    maskValuesRaw.forEach(bit => {
      addr |= bit; // set to 1
      if (arr.indexOf(bit) < 0) {
        addr ^= bit; // set to 0
      }
    })

    return addr;
  });
}

const applyMask2 = (mem, mask, lhs, rhs) => {
  const baseAddr = BigInt(lhs.match(/mem\[([0-9]+)\]/)[1]);
  const value = BigInt(rhs);
  const maskValues = getMaskValues(baseAddr, mask);

  maskValues.forEach(maskValue => {
    // console.log(`mem[${maskValue}] = ${value}`);
    mem[maskValue] = value;
  });
}

const parseMask2 = (maskSt) => {
  const orMask = BigInt(`0b${maskSt.replace(/X/g, "0")}`);
  const floatMask = BigInt(`0b${maskSt.replace(/1/g, "0").replace(/X/g, "1")}`);
  return {orMask, floatMask};
}

const processCommands2 = (mem, cmds) => {
  let mask = {
    orMask: BigInt(0),
    floatMask: BigInt(0)
  };
  cmds.forEach(cmd => {
    const parts = cmd.split(" = ");
    if (parts[0] == "mask") { 
      mask = parseMask2(parts[1]);
    } else {
      applyMask2(mem, mask, parts[0], parts[1]);
    }
  });
}

const bigIntSum = (bArr) => {
  let sum = BigInt(0);
  Object.getOwnPropertyNames(bArr).forEach(addr => {
    sum += bArr[addr]
  })

  return sum;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day14.txt", "\n");

  let mem1 = {}
  processCommands1(mem1, st);
  console.log(bigIntSum(mem1));

  let mem2 = {}
  processCommands2(mem2, st);
  console.log(bigIntSum(mem2));
}

module.exports = { run };
