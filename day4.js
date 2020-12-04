const {readStringArrayFromFile} = require("./lib");

const parseLine = (line, currPassport) => {
  const entries = line.split(" ");
  entries.forEach((entry) => {
    const parts = entry.split(":");
    currPassport[parts[0]] = parts[1];
  })
}

const parsePassports = (data) => {
  let line = 0;
  let passports = [];
  let currPassport = {}
  while (line < data.length) {
    const lineSt = data[line];
    if (lineSt.length > 0) {
      parseLine(lineSt, currPassport);
    } else {
      passports.push(currPassport);
      currPassport = {};
    }
    line++;
  }

  return passports;
}

const isValid = (passport) => {
  /*
  byr (Birth Year)
iyr (Issue Year)
eyr (Expiration Year)
hgt (Height)
hcl (Hair Color)
ecl (Eye Color)
pid (Passport ID)
OK: cid (Country ID)
*/
  return passport.byr && passport.iyr && passport.eyr && passport.hgt &&passport.hcl && passport.ecl && passport.pid;
}

const isValid2 = (passport) => {
  if (!isValid(passport)) {return false;}

  /*
  byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
  */

  const by = parseInt(passport.byr);
  if (passport.byr.length != 4 || by < 1920 || by > 2002) return false;

  const iy = parseInt(passport.iyr);
  if (passport.iyr.length != 4 || iy < 2010 || iy > 2020) return false;

  const ey = parseInt(passport.eyr);
  if (passport.eyr.length != 4 || ey < 2020 || ey > 2030) return false;

  //hgt
  if (passport.hgt.match(/[0123456789]+in/)) {
    const inches = parseInt(passport.hgt.split("in"));
    if (inches < 59 || inches > 76) return false;
  } else if (passport.hgt.match(/[0123456789]+cm/)) {
    const cm = parseInt(passport.hgt.split("cm"));
    if (cm < 150 || cm > 193) return false;
  } else {
    return false;
  }

  //hcl
  if (passport.hcl.length != 7 || !passport.hcl.match(/\#[0123456789abcdef]+/)) return false;

  //ecl
  if (["amb","blu","brn","gry","grn","hzl","oth"].indexOf(passport.ecl) < 0) return false;

  const pid = parseInt(`1${passport.pid}`);
  return pid >= 1000000000 && pid <= 1999999999;
}


const run = () => {
  const st = readStringArrayFromFile("./input/day4.txt", "\n");

  const passports = parsePassports(st);
  const valid = passports.filter(isValid2);

  console.log(valid.length);
}

module.exports = { run };