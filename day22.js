const {readStringArrayFromFile} = require("./lib");

const play1 = (hands) => {
  const h = [hands[0].shift(), hands[1].shift()];
  
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

const playGamePart1 = (hands) => {
  while (hands[0].length && hands[1].length) {
    play1(hands);
  }
}

const play2 = (hands, history) => {
  // console.log(` - ${hands[0].length} vs ${hands[1].length}`)

  const historyKey = getHistoryKey(hands);
  if (history.indexOf(historyKey) >= 0) {
    return 1;
  }
  history.push(historyKey);
  // console.log(`  Hand: ${historyKey.length}`)

  
  let winner;
  const h = [hands[0].shift(), hands[1].shift()];
  if (h[0] > hands[0].length || h[1] > hands[1].length) {
    winner = (h[0] > h[1]) ? 0 : 1;
  } else {
    const recurseHands = [
      hands[0].slice(0, h[0]),
      hands[1].slice(0, h[1])
    ];
    
    winner = playGamePart2(recurseHands);
  }
  
  hands[winner].push(h[winner]);
  hands[winner].push(h[1 - winner]);
}

const getHistoryKey = (hands) => {
  return JSON.stringify(hands);
}

const playGamePart2 = (hands) => {
  // console.log(`Playing ${hands[0].length} vs ${hands[1].length}`)
  let history = [];
  let gameOverDup = 0
  while (!gameOverDup && hands[0].length && hands[1].length) {
    gameOverDup = play2(hands, history);
  }
  
  if (gameOverDup) {
    return 0; // player 1
  } else {
    return hands[0].length ? 0 : 1;
  }
}

const run = () => {
  let st = readStringArrayFromFile("./input/day22test.txt", "\n\n");
  
  
  let hands = st.map(hand => {return hand.split("\n").slice(1).map(Number)});
//  playGamePart1(hands);
//  const winningHand = hands[0].length ? 0 : 1;

  const winningHand = playGamePart2(hands);
  
  const score = getScore(hands[winningHand]);
  console.log("ANSWER:", score);

}

module.exports = { run };
