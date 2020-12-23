const {readStringArrayFromFile} = require("./lib");

const takeThree = (cups) => {
  const temp = cups.shift();
  const crab = [cups.shift(), cups.shift(), cups.shift()];
  cups.unshift(temp);
  return crab;
}

const rotateTo = (cups, value) => {
  console.log(`rotating to ${value}`)
  if (!value) throw new Error("TEST");
  while (cups[0] != value) {
    console.log(`Looking for ${value}: ${cups}`)
    const temp = cups.shift();
    cups.push(temp);
  }
}

const putBackIn = (cups, crab) => {
  const temp = cups.shift();
  cups.unshift(crab[2]);
  cups.unshift(crab[1]);
  cups.unshift(crab[0]);
  cups.unshift(temp);
}

const nextCup = (cups, target) => {
  let i = 0;
  while (cups[i] != target) {
    console.log(i);
    i = (i + 1) % cups.length;
  }
  i = (i + 1) % cups.length; // one more
  
 // console.log (`nextCup returning cups[${i}]: ${cups[i]}`)
  return cups[i];
}

const move = (cups, currCup) => {
  
  const minV = Math.min(...cups);
  const maxV = Math.max(...cups);

  rotateTo(cups, currCup);
  const crab = takeThree(cups);
  // console.log(`Pick up: ${crab}`)
  // console.log(`left: ${cups}`)

  let target = cups[0] - 1;
  while (crab.indexOf(target) >= 0) {
    // console.log("target: ", target)
    target--;
    if (target < minV) {
      target = maxV;
    }
  }
  rotateTo(cups, target);

  putBackIn(cups, crab);

  return nextCup(cups, currCup)
}

const run = () => {
  //let st = "589174263";
  //let count = 100;
  let st = "389125467"
  let count = 10;
  
  let cups = st.split("").map(Number);
  
  let target = cups[0]
  for (let i = 0; i < count; i++) {
    target = move(cups, target);
    if (!target) throw new Error('target is zero')
    console.log(cups.map(c => {
      return (c == target) ? `(${c})` : `${c}`;
    }).join(" "))
  }
  
  console.log("ANSWER (Part 1):", cups.map(String).join(""));


}

module.exports = { run };
