const {readStringArrayFromFile} = require("./lib");

const parseFoods = (st) => {
  const foodMatch = st.match(/([a-z ]+) \(contains ([a-z, ]+)\)/);
  if (foodMatch) {
    return {
      allergens: foodMatch[2].split(", "),
      ingr: foodMatch[1].split(" ")
    }
  } else {
    //no allergen
    return {
      allergens: [],
      ingr: st.split(" ")
    }
  }
}

const updatePossibilities = (allergenPossibilities, allergen, ingrs) => {
  // console.log(`updatePossibilities(..., ${allergen}, ${JSON.stringify(ingrs)})`);
  const currPossibilities = allergenPossibilities[allergen];
  if (!currPossibilities) {
    // console.log(`${allergen} new`, JSON.stringify(ingrs));
    allergenPossibilities[allergen] = JSON.parse(JSON.stringify(ingrs));
    return;
  }

  // console.log("currPossibilities: ", JSON.stringify(currPossibilities));
  const stillValidPossibilities = currPossibilities.filter( ingr => {
    // console.log(`is ${ingr} in ${JSON.stringify(ingrs)} : ${ingrs.indexOf(ingr) >= 0}`);
    return ingrs.indexOf(ingr) >= 0
  })

  // console.log(`${allergen} update`, JSON.stringify(stillValidPossibilities));
  allergenPossibilities[allergen] = stillValidPossibilities;
}

const getAllergenPossibilites = (foods) => {
  let allergenPossibilities = {};

  for (let foodNum in foods) {
    const food = foods[foodNum];

    for (let allergenNum in food.allergens) {
      const allergen = food.allergens[allergenNum];
      updatePossibilities(allergenPossibilities, allergen, food.ingr);
    }
  }

  return allergenPossibilities;
}

const getAllIngr = (foods) => {
  return foods.map(food => {return food.ingr}).flat();
}

const getAllTaintedIngr = (allergenPossibilities) => {
  return Object.getOwnPropertyNames(allergenPossibilities).map(pos => {return allergenPossibilities[pos]}).flat();
}

const run = () => {
  let st = readStringArrayFromFile("./input/day21.txt", "\n");
  const foodList = st.map(parseFoods);
  const allergenPossibilities = getAllergenPossibilites(foodList);
  const allTaintedIngr = getAllTaintedIngr(allergenPossibilities);
  const allIngr = getAllIngr(foodList);
  const cleanIngr = allIngr.filter(ingr => {
    return allTaintedIngr.indexOf(ingr) < 0;
  })

  console.log(JSON.stringify(allergenPossibilities, null, 2));

  console.log("ANSWER (Part 1):", cleanIngr.length);

  // manually checked out the output from the allergenPossibility dump above for part 2

}

module.exports = { run };
