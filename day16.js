const {readStringArrayFromFile} = require("./lib");

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

const ticketIsValid = (checks, ticket) => {
  for (let i = 0; i < ticket.length; i++) {
    if (!isValidValue(checks, ticket[i])) {
      return false;
    }
  }

  return true;
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
    return ticketIsValid(checks, ticket)
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

const getTicketAnswer = (validOrder, yourTicket) => {
  let product = 1;
  for (let i = 0; i < validOrder.length; i++) {
    const check = validOrder[i];
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
      if (fieldNum == 1 && check.name=='duration') {
        console.log(`${check.name} not valid at ${fieldNum} with ${ticket[fieldNum]} on ticket ${i} ranges: ${JSON.stringify(check.ranges)}`);
        console.log(`failed ticket: ${ticket}`);
      }
      return false;
    }
  }

  return true;
}

const getValidAtPositionArrays = (checks, tickets) => {
  let valid = new Array(checks.length);

  for (let pos = 0; pos < checks.length; pos++) {
    let validForPos = [];
    for (let checkNum = 0; checkNum < checks.length; checkNum++) {

      if (isValidForCheck2(checks[checkNum], pos, tickets)) {
        validForPos.push(checks[checkNum]);
      }
    }
    valid[pos] = validForPos;
  }

  return valid;
}

const getValidAssignment = (validAtPosition, soFar = [], soFarNames = []) => {
  const pos = soFar.length;
  const options = validAtPosition[pos];
  for (let optionNum = 0; optionNum < options.length; optionNum++) {
    const option = options[optionNum];
    if (pos <= 1) {console.log(`@${pos} #${optionNum}: ${option.name}, soFar: ${soFarNames}`);}
    if (soFarNames.indexOf(option.name) < 0) {
      if (soFarNames.length + 1 == validAtPosition.length) {
        return [...soFar, option];
      }

      const validAssignment = getValidAssignment(validAtPosition, [...soFar, option], [...soFarNames, option.name]);
      if (validAssignment) {
        return validAssignment;
      }
    }
  }

  return null;
}


const run = () => {
  let st = readStringArrayFromFile("./input/day16.txt", "\n\n");
  let {checks, yourTicket, nearbyTickets} = parseData(st);

  const answer = getErrorScanningRate(checks, nearbyTickets);
  console.log("ANSWER (Part 1):", answer);

  // console.log("TOTAL TICKETS: ", nearbyTickets.length);
  const validTickets = getValidTickets(checks, nearbyTickets);
  // console.log("VALID TICKETS: ", validTickets.length);

  const validAtPosition = getValidAtPositionArrays(checks, validTickets);
  // console.log("valid for each position: ", validAtPosition.map((v) => {return v.length}));

  const validAssignment = getValidAssignment(validAtPosition);
  console.log(validAssignment);

  if (validAssignment) {
    const answer2 = getTicketAnswer(validAssignment, yourTicket);
    console.log("ANSWER (Part 2):", answer2);
  } else {
    console.log("FAILURE");
  }
}

module.exports = { run };
