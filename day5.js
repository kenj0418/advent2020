const {readStringArrayFromFile} = require("./lib");

const max = (arr) => {
  let maxSoFar = 0;
  arr.forEach((val) => {
    if (val > maxSoFar) {
      maxSoFar = val;
    }
  });
  return maxSoFar;
}

const min = (arr) => {
  let minSoFar = 999999999;
  arr.forEach((val) => {
    if (val < minSoFar) {
      minSoFar = val;
    }
  });
  return minSoFar;
}

const parseSeat = (line) => {
  const row = parseInt(line.slice(0, 7).replace(/F/g, "0").replace(/B/g, "1"),2);
  const col = parseInt(line.slice(7).replace(/L/g, "0").replace(/R/g, "1"),2);

  return {row, col}
}

const getSeatId = (seat) => {
  return seat.row * 8 + seat.col;
}

const findMissingSeat = (seats) => {
  const seatIds = seats.map(getSeatId);
  const minSeat = min(seatIds);
  const maxSeat = max(seatIds);

  for (let i = minSeat; i <= maxSeat; i++) {
    if (seatIds.indexOf(i) < 0) {
      return i;
    }
  }
}

const run = () => {
  const st = readStringArrayFromFile("./input/day5.txt", "\n");
  const seats = st.map(parseSeat);
  const seatIds = seats.map(getSeatId);
  // console.log(seats);
  // console.log(seatIds);
  console.log(max(seatIds));
  console.log(findMissingSeat(seats));
}

module.exports = { run };