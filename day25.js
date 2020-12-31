const modValue = 20201227;

const findParameters = (targetKey) => {
  for (let subjectNumber = 2; subjectNumber < modValue; subjectNumber++) {
    let loopSize = 1
    let currKey = subjectNumber;

    while (loopSize < modValue) {
      if (currKey == targetKey) {
        return {subjectNumber, loopSize}
      }

      loopSize++;
      currKey = currKey * subjectNumber % modValue;
    }
  }

  throw new Error(`Key values not determined: ${targetKey}`);
}

const calculateEncryptionKey = (subjectNumber, loopSize) => {
  let currKey = 1;
  for (let i = 0; i < loopSize; i++) {
    currKey = currKey * subjectNumber % modValue;
  }

  return currKey;
}


const run = () => {
  const cardKey = 19774466
  const doorKey = 7290641
  // const cardKey = 5764801;
  // const doorKey = 17807724;

  const cardValues = findParameters(cardKey);
  const doorValues = findParameters(doorKey);
  const encryptionKey1 = calculateEncryptionKey(doorKey, cardValues.loopSize);
  const encryptionKey2 = calculateEncryptionKey(cardKey, doorValues.loopSize);
  
  console.log("ANSWER (part 1) :", Math.max(encryptionKey1, encryptionKey2));
  // 12061421 too low
  // 102657985122924 too high

}

module.exports = { run };
