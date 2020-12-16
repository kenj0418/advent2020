const {readStringArrayFromFile, permutator} = require("./lib");

const parseCheck = (checkSt) => {
  const parts = checkSt.split(": ");
  const rangesSt = parts[1].split(" or ");
  const ranges = rangesSt.map(rangeSt => {
    const rangeParts = rangeSt.split("-");
    return {start: parseInt(rangeParts[0]), end: parseInt(rangeParts[1])};
  })
  return {name: parts[0], ranges};
}

const parseChecks = (st) => {
  const checkSt = st.split("\n");
  return checkSt.map(parseCheck);
}

const parseTickets = (st) => {
  const tickSt = st.split("\n").slice(1);
  return tickSt.map((tick) => {return tick.split(",").map(Number)});
}

const parseData = (st) => {
  let checks = parseChecks(st[0]);
  let yourTicket = parseTickets(st[1])[0];
  let nearbyTickets = parseTickets(st[2]);

  return {checks, yourTicket, nearbyTickets};
}

const isValidForRange = (range, value) => {
  if (!range) return false;
  return range.start <= value && range.end >= value;
}

const isValidForCheck = (check, value) => {
  for (let rangeNum = 0; rangeNum <= check.ranges.length; rangeNum++) {
    const range = check.ranges[rangeNum];
    if (isValidForRange(range, value)) {
      return true;
    }
  }

  return false;
}

const isValidValue = (checks, value) => {
  for (let checkNum = 0; checkNum < checks.length; checkNum++) {
    if (isValidForCheck(checks[checkNum], value)) {
      return true;
    }
  }

  return false;
}

const getError = (checks, ticket) => {
  for (let i = 0; i < ticket.length; i++) {
    if (!isValidValue(checks, ticket[i])) {
      return ticket[i];
    }
  }

  return 0;
}

const getErrorScanningRate = (checks, tickets) => {
  let errors = 0;
  tickets.forEach(ticket => {
    errors += getError(checks, ticket)
  });
  return errors;
}

const getValidTickets = (checks, tickets) => {
  return tickets.filter(ticket => {
    return getError(checks, ticket) == 0
  })
}

const isValidForTicket = (perm, ticket) => {
  for (let i = 0; i < ticket.length; i++) {
    if (!isValidForCheck(perm[i], ticket[i])) {
      return false;
    }
  }

  return true;
}

const isValidPermutation = (perm, nearbyTickets) => {
  for (let i = 0; i < nearbyTickets.length; i++) {
    if (!isValidForTicket(perm, nearbyTickets[i])) {
      return false;
    }
  }
  
  return true;
}

const findValidOrder = (checkPermutations, nearbyTickets) => {
  for (let i = 0; i < checkPermutations.length; i++) {
    const perm = checkPermutations[i];
    if (isValidPermutation(perm, nearbyTickets)) {
      return perm;
    }
  }

  throw new Error("NONE VALID");
}

const getTicketAnswer = (validOrder, yourTicket) => {
  let product = 1;
  for (let i = 0; i < validOrder.length; i++) {
    const check = validOrder[i];
    console.log(check);
    if (check.name.startsWith("departure")) {
      product *= yourTicket[i];
    }
  }

  return product;
}

const isValidForCheck2 = (check, fieldNum, nearbyTickets) => {
  if (!check) return false;

  for (let i = 0; i < nearbyTickets.length; i++) {
    const ticket = nearbyTickets[i];
    if (!isValidForCheck(check, ticket[fieldNum])) {
      console.log(`${check.name} not valid at ${fieldNum} with ${ticket[fieldNum]} on ticket ${i} ranges: ${JSON.stringify(check.ranges)}`);
      console.log(`failed ticket: ${ticket}`);
      return false;
    }
  }

  console.log(`${check.name} IS valid at ${fieldNum}`);
  return true;
}

const findValidPermutation = (checks, tickets) => {
  const permute = (arr, m = []) => {
    if (m.length && !isValidForCheck2(m[m.length - 1], m.length - 1, tickets)) {
      // console.log(`${m[m.length - 1].name} not valid in position ${m.length - 1}`);
      // not valid
    } else  if (arr.length === 0) {
      console.log("FOUND IT");
      return m;
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);

        permute(curr.slice(), m.concat(next))
      }
    }
  }

  return permute(checks);
}

const run = () => {
  let st = readStringArrayFromFile("./input/day16.txt", "\n\n");
  let {checks, yourTicket, nearbyTickets} = parseData(st);
  // console.log(JSON.stringify(checks));
  // console.log(yourTicket);
  // console.log(nearbyTickets);

  const answer = getErrorScanningRate(checks, nearbyTickets);
  console.log(answer);

  console.log("TOTAL TICKETS: ", nearbyTickets.length);
  const validTickets = getValidTickets(checks, nearbyTickets);
  console.log("VALID TICKETS: ", validTickets.length);
  const validOrder = findValidPermutation(checks, validTickets);
  console.log(validOrder);
  if (validOrder) {
    const answer2 = getTicketAnswer(validOrder, yourTicket);
    console.log(answer2);
  } else {
    console.log("FAILURE");
  }
}

module.exports = { run };

/*
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
*/