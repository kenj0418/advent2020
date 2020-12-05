const {readStringArrayFromFile} = require("./lib");

const parseSeat = (line) => {
  const row = parseInt(line.slice(0, 7).replace(/F/g, "0").replace(/B/g, "1"),2);
  const col = parseInt(line.slice(7).replace(/L/g, "0").replace(/R/g, "1"),2);

  return {row, col}
}

const getSeatId = (seat) => {
  return seat.row * 8 + seat.col;
}

const findMissingSeat = (seatIds) => {
  const minSeat = Math.min(...seatIds);
  const maxSeat = Math.max(...seatIds);

  for (let i = minSeat; i <= maxSeat; i++) {
    if (seatIds.indexOf(i) < 0) {
      return i;
    }
  }
}

const run = () => {
  const seats = readStringArrayFromFile("./input/day5.txt", "\n").map(parseSeat);
  const seatIds = seats.map(getSeatId);

  console.log(`Max Seat id: ${Math.max(...seatIds)}`);
  console.log(`Missing Seat id: ${findMissingSeat(seatIds)}`);
}

module.exports = { run };