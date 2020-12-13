const {readStringArrayFromFile, sum} = require("./lib");

const advanceBuses = (buses, busTimes, currTime) => {
  busTimes.forEach((busTime, i) => {
    if (busTime < currTime) {
      busTimes[i] += buses[i]
    }
  });
}

const findEarliestBus = (buses, earliest) => {
  let busTimes = buses.map((bus) => {return Math.floor(earliest / bus) * bus;})

  let currTime = earliest;
  while (busTimes.indexOf(currTime) < 0) {
    advanceBuses(buses, busTimes, currTime);
    currTime++;
  }

  const index = busTimes.indexOf(currTime);
  return {bus: buses[index], time: currTime};
}

const isValid = (buses, time) => {
  for (let i = 0; i < buses.length; i++) {
    if (buses[i] && ((time + i) % buses[i] != 0)) {
      return false;
    }
  }

  return true;
}

const findStarTimeToSimple = (buses) => {
  let currTime = buses[0];
  while (!isValid(buses, currTime)) {
    currTime += buses[0];
  };

  return currTime;;
  // 7,13,x,x,59,x,31,19
  // 1789,37,47,1889
}

const findStarTimeSlow = (buses) => {
  //stopped previous time at //14637630000000
  let step = Math.max(...buses);
  // let step = buses[0];
  let stepIndex = buses.indexOf(step);
  console.log(step);
  console.log(stepIndex);
  let currTime = step - stepIndex;
  while (!isValid(buses, currTime)) {
    currTime += step;
    // if (currTime % 100000000 == 0) {
    //   console.log(`t=${currTime}`);
    // }
  };

  return currTime;;
  // 7,13,x,x,59,x,31,19
  // 1789,37,47,1889
}

const countMatches = (buses, time) => {
  for (let i = 0; i < buses.length; i++) {
    if (buses[i] && ((time + i) % buses[i] != 0)) {
      return i;
    }
  }

  return buses.length;
}

const sumMatches = (buses, maxMatchCount) => {
  const values = buses.slice(0, maxMatchCount).filter((bus) => {return bus > 0});
  return sum(values);
}

const findStarTimeNotWorking = (buses) => {
  let step = buses[0];
  let currTime = step;
  let maxMatchCount = 1;
  let found = false;
  while (!found) {
    const matchNum = countMatches(buses, currTime);
    if (matchNum == buses.length) {
      found = true;
    } else if (matchNum > maxMatchCount) {
      maxMatchCount = matchNum;
      step = sumMatches(buses, maxMatchCount);
      currTime += step;
    } else {
      currTime += step;
    }
  }

  return currTime;

  // if (currTime % 10000000 == 0) {
  //   console.log(`t=${currTime}`);
  // }

}

const run = () => {
  let st = readStringArrayFromFile("./input/day13.txt", "\n");

  // const earliestTime = parseInt(st[0]);
  // const buses = st[1].split(",").filter((bus) => {return bus != "x"}).map(bus => {return parseInt(bus)});
  // console.log(earliestLeaveTime);
  // console.log(buses);

  // const {bus, time} = findEarliestBus(buses, earliestTime);
  // console.log(`${bus * (time - earliestTime)}`);

  const buses = st[1].split(",").map((bus) => {
    if (bus == "x") {
      return null;
    } else {
      return parseInt(bus);
    }
  });
  // console.log(buses);
  const starTime = findStarTimeSlow(buses);
  console.log(starTime);
}

module.exports = { run };
