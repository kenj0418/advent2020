const {readStringArrayFromFile} = require("./lib");

const play = (hands) => {
  const h = [hands[0].shift(), hands[1].shift()];
  
  if (h[0] == h[1]) {
    console.log("TIE??")
  }
  
  const winner = (h[0] > h[1]) ? 0 : 1;
  hands[winner].push(h[winner]);
  hands[winner].push(h[1 - winner]);
}

const getScore = (hand) => {
  let score = 0
  let len = hand.length;
  
  for (let i = 0; i < hand.length; i++) {
    score += (len - i) * hand[i];
  }
  
  return score;
}

const run = () => {
  let st = readStringArrayFromFile("./input/day22.txt", "\n\n");
  
  
  let hands = st.map(hand => {return hand.split("\n").slice(1).map(Number)});
  
  let roundNum = 0
  while (hands[0].length && hands[1].length) {
//    console.log(`R${roundNum} H1: ${hands[0]}`);
//    console.log(`R${roundNum} H2: ${hands[1]}`);
//    if (roundNum % 1048576 == 0 || roundNum % 1048576 == 1) {
//      console.log(`ROUND ${roundNum}:  H1: ${hands[0].length}  H2: ${hands[1].length}`)
//    }
    roundNum++
    play(hands);
    if (roundNum > 1048576*4) {
      console.log(hands)
      return
    }
  }
  

  
  console.log(hands);
  const winningHand = hands[0].length ? hands[0] : hands[1];
  const score = getScore(winningHand);

  console.log("ANSWER (Part 1):", score);


}

module.exports = { run };
