class CupGame {
  constructor(initial) {
    this.cups = initial;
    this.currentIndex = 0;
  }

  takeThree() {
    return [this.takeOne(), this.takeOne(), this.takeOne()];
  }

  takeOne() {
    if (this.currentIndex + 1 == this.cups.length) {
      const cup = this.cups[0];
      this.cups = this.cups.slice(1);
      this.currentIndex--;
      return cup;
    } else {
      const cup = this.cups[this.currentIndex + 1];
      this.cups = [...this.cups.slice(0, this.currentIndex + 1), ...this.cups.slice(this.currentIndex + 2)];
      return cup;
    }
  }

  static fromString(initialSt) {
    return new CupGame(initialSt.split("").map(Number));
  }

  getDestination() {
    let targetValue = this.cups[this.currentIndex] - 1;

    while(true) {
      const index = this.cups.indexOf(targetValue);
      if (index >= 0) {
        return index;
      }

      targetValue--;

      if (targetValue <= 0) {
        targetValue = 9;
      }
    }
  }

  place(cups, destination) {
    if (destination < this.currentIndex) {
      this.currentIndex += cups.length;
    }
    this.cups = [...this.cups.slice(0, destination + 1), ...cups, ...this.cups.slice(destination + 1)];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cups.length;
  }

  displayCups() {
    const cupStrings = this.cups.map((cup, index) => {
      if (index == this.currentIndex) {
        return `(${cup})`;
      } else {
        return `${cup}`;
      }
    })

    console.log(`cups:  ${cupStrings.join(" ")}`);
  }

  move() {
    this.displayCups();
    const threeCups = this.takeThree();
    console.log(`pick up: ${threeCups}`);
    const destination = this.getDestination();
    this.place(threeCups, destination);
    this.next();
    console.log(`destination: ${this.cups[this.currentIndex]}`);
    console.log("------");
  }

  getLabelsFromOne() {
    const onePos = this.cups.indexOf(1);
    if (onePos < 0) {
      throw new Error("NO ONE");
    }

    const cupsInOrder = [...this.cups.slice(onePos + 1), ...this.cups.slice(0, onePos)];
    return cupsInOrder.map(cup => {return `${cup}`}).join("");
  }

/*
The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
*/
}

const run = () => {
  let st = "589174263";
  // let st = "389125467"
  let count = 100;
  
  let cups = CupGame.fromString(st);
  
  for (let i = 0; i < count; i++) {
    cups.move();
  }

  console.log("ANSWER (Part 1):", cups.getLabelsFromOne());


}

module.exports = { run };
