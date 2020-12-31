class Cup {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class CupGame {
  constructor(initial, maxValue) {
    let firstCup = null;
    let prevCup = null;

    for (let i = 0; i < initial.length; i++) {
      const currCup = new Cup(initial[i]);
      if (prevCup) {
        prevCup.next = currCup;
      } else {
        firstCup = currCup;
      }
      prevCup = currCup;
    }

    for (let i = initial.length; i <= maxValue; i++) {
      const currCup = new Cup(initial[i]);
      prevCup.next = currCup;
      prevCup = currCup;
    }

    prevCup.next = firstCup;
    this.currentCup = firstCup;
    this.maxValue = maxValue;
  }

  takeThree() {
    return [this.takeOne(), this.takeOne(), this.takeOne()];
  }

  takeOne() {
    const cup = this.currentCup.next;
    this.currentCup.next = this.currentCup.next.next;
    return cup;
  }

  static fromString(initialSt, totalCount) {
    return new CupGame(initialSt.split("").map(Number), totalCount);
  }

  getDestination(removedCups) {
    const removedValues = removedCups.map(cup => {return cup.value});
    let targetValue = this.currentCup.value - 1;

    while(true) {
      if (targetValue <= 0) {
        targetValue = this.maxValue;
      }

      if (removedValues.indexOf(targetValue) < 0) {
        return this.findCup(targetValue);
      }

      targetValue--;
    }
  }

  findCup(targetValue) {
    if (this.currentCup.value == targetValue) {
      return this.currentCup;
    }

    let cup = this.currentCup.next;
    const stopValue = this.currentCup.value;
    while (cup.value != targetValue && cup.value != stopValue) {
      cup = cup.next;
    }

    if (cup.value == targetValue) {
      return cup;
    } else {
      throw new Error(`Unable to find : ${targetValue}`);
    }
  }

  placeCup(cup, destination) {
    cup.next = destination.next;
    destination.next = cup;
  }

  place(cups, destination) {
    this.placeCup(cups[2], destination);
    this.placeCup(cups[1], destination);
    this.placeCup(cups[0], destination);
  }

  next() {
    this.currentCup = this.currentCup.next;
  }

  move() {
    const threeCups = this.takeThree();
    const destination = this.getDestination(threeCups);
    if (!destination) {
      throw new Error("Did not find desintation")
    }
    this.place(threeCups, destination);
    this.next();
  }

  getLabelsFromOne() {
    let currCup = this.findCup(1).next;
    let st = ""
    while (currCup.value != 1) {
      st += `${currCup.value}`;
      currCup = currCup.next;
    }
    return st;
  }
}

const run = () => {
  // let st = "589174263";
  let st = "389125467"
  let count = 100;
  
  let cups = CupGame.fromString(st, 9);
  
  for (let i = 0; i < count; i++) {
    cups.move();
  }

  console.log("ANSWER (Part 1):", cups.getLabelsFromOne());

}

module.exports = { run };
