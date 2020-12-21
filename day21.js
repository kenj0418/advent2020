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

const findFoodsWithNoAllergens = (foods) => {
  return foods.filter(food => {
    return food.allergens.length == 0
  }).map(food => {
    return food.ingr
  }).flat();
}

const findFoodsWithOneAllergen = (foods) => {
  return foods.filter(food => {
    console.log("findFoodsWithOneAllergen food", JSON.stringify(food));
    return food.allergens.length == 1
  }).map(food => {
    return {
      allergen: food.allergens[0],
      ingr: food.ingr
    }
  });
}

const findOneIngredientAllergens = (foods) => {
  return foods.filter(food => {
    return food.allergens.length == 1 && food.ingr.length == 1
  }).map(food => {
    return {
      allergen: food.allergens[0],
      ingr: food.ingr[0]
    }
  })
}

const containsAllergen = (food, allergen) => {
  if (!food || !allergen) return false;

  return food.allergens.indexOf(allergen) >= 0;
}

const removeIngr = (foods, ingr, exceptAllergen) => {
  console.log(`removing: ${ingr} from all allergens except ${exceptAllergen}`);
  const result = foods.map(food => {
    const filteredIngr = food.ingr.filter(i => {
      return i != ingr || containsAllergen(food, exceptAllergen) 
    });

    return {
      allergens: food.allergens,
      ingr: filteredIngr
    }
  })
  // console.log(`removeIngr: ${JSON.stringify(result[1])}`)
  return result;
}

const removeAllergen = (foods, ingr) => {
  return foods.map(food => {
    const filteredAllergen = food.ingr.filter(i => {return i != ingr});
    return {
      allergens: filteredAllergen,
      ingr: food.ingr
    }
  })
}

const simplify = (origFoods, origNoAllergens, origWithAllergens) => {
  let foods = JSON.parse(JSON.stringify(origFoods));
  let noAllergens = JSON.parse(JSON.stringify(origNoAllergens));
  let withAllergens = JSON.parse(JSON.stringify(origWithAllergens));

  // remove any with no allergens
  const foodsWithNoAlergens = findFoodsWithNoAllergens(foods);
  for (index in foodsWithNoAlergens) {
    const ingr = foodsWithNoAlergens[index]
    console.log(`Has no allergen: ${ingr}`)
    noAllergens.push(ingr);
    foods = removeIngr(foods, ingr);
    console.log("FOODS1:", JSON.stringify(foods));
  }

  // remove any with exactly one ingredients
  const knownAllergensAndIngr = findOneIngredientAllergens(foods);
  for (index in knownAllergensAndIngr) {
    const known = knownAllergensAndIngr[index]
    console.log(`${known.ingr} has ${known.allergen}`)
    withAllergens.push(known.ingr);
    foods = removeIngr(foods, known.ingr);
    foods = removeAllergen(foods, known.allergen)
  }

  // filter down any ingr with only one allergen
  const knownAllergen = findFoodsWithOneAllergen(foods);
  for (index in knownAllergen) {
    const known = knownAllergen[index]
    console.log("---");
    console.log(known)
    console.log(`${known.allergen} must be one of ${JSON.stringify(known.ingr)}`);
    console.log("FOODS3bef:", JSON.stringify(foods));
    for (i in known.ingr) {
      foods = removeIngr(foods, known.ingr[i], known.allergen);
    }
    console.log("FOODS3aft:", JSON.stringify(foods));
    console.log("---");
  }

  foods = foods.filter((food) => {
    return food.allergens.length != 0 || food.ingr.length != 0
  })

  return {foods, noAllergens, withAllergens}
}

const determineAllergens = (origFoods) => {
  let foods = JSON.parse(JSON.stringify(origFoods));
  let noAllergens = []
  let withAllergens = []

  let before = "x";
  let after = "y";
  let cycles = 0
  while (before != after) {
    before = `${JSON.stringify(foods)}/${JSON.stringify(noAllergens)}/${JSON.stringify(withAllergens)}`;
    const result = simplify(foods, noAllergens, withAllergens);
    foods = result.foods;
    noAllergens = result.noAllergens;
    withAllergens = result.withAllergens
    after = `${JSON.stringify(foods)}/${JSON.stringify(noAllergens)}/${JSON.stringify(withAllergens)}`;
    cycles++;
  }
  console.log(`Cycles: ${cycles}`);

  return {
    noAllergens,
    withAllergens,
    unknown: foods
  }
}

const run = () => {
  let st = readStringArrayFromFile("./input/day21.txt", "\n");
  const foodList = st.map(parseFoods);
  const foods = determineAllergens(foodList);

  console.log(JSON.stringify(foods, null, 2));

  console.log("ANSWER (Part 1):", foods.noAllergens.length);

}

module.exports = { run };
