const {readStringArrayFromFile} = require("./lib");

const parseLine = (line) => {
  let currPassport = {}
  const entries = line.split(" ");
  entries.forEach((entry) => {
    const parts = entry.split(":");
    currPassport[parts[0]] = parts[1];
  })

  return currPassport;
}

const parsePassports = (lines) => {
  let passports = [];
  let currPassport = {}
  lines.forEach(line => {
    if (line.length > 0) {
      const newData = parseLine(line);
      currPassport = {...currPassport, ...newData}
    } else {
      passports.push(currPassport);
      currPassport = {};
    }
  })

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
  const hgParts = passport.hgt.match(/^([0-9]+)((?:cm|in))$/)
  if (!hgParts) return false;
  const hgUnit = hgParts[2];
  const hg = hgParts[1];

  if (hgUnit == "in" && (hg < 59 | hg > 76)) return false;
  if (hgUnit == "cm" && (hg < 150 | hg > 193)) return false;

  //hcl
  if (!passport.hcl.match(/^\#[0-9a-f]{6}$/)) return false;

  //ecl
  if (["amb","blu","brn","gry","grn","hzl","oth"].indexOf(passport.ecl) < 0) return false;

  //pid
  return passport.pid.match(/^[0-9]{9}$/);
}


const run = () => {
  const st = readStringArrayFromFile("./input/day4.txt", "\n");

  const passports = parsePassports(st);
  const valid = passports.filter(isValid2);

  console.log(valid.length);
}

module.exports = { run };