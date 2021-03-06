const {readStringArrayFromFile} = require("./lib");

const getNeighbors = (loc) => {
  let neighbors = []
  for (let x = loc.x-1; x <= loc.x+1; x++) {
    for (let y = loc.y-1; y <= loc.y+1; y++) {
      for (let z = loc.z-1; z <= loc.z+1; z++) {
        for (let w = loc.w-1; w <= loc.w+1; w++) {
          if (x != loc.x || y != loc.y || z != loc.z || w != loc.w) {
            neighbors.push({x,y,z,w});
          }
        }
      }
    }
  }

  return neighbors;
  // Each cube only ever considers its neighbors:
  // any of the 26 other cubes where any of their coordinates differ by at most 1.
  // For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.
}

const getKey = (loc) => {
  return `${loc.x},${loc.y},${loc.z},${loc.w}`
}

const isActive = (cubes, loc) => {
  return cubes.active[getKey(loc)];
}

const getNextState = (cubes, loc) => {
  const neighbors = getNeighbors(loc);
  let neighborCount = 0
  neighbors.forEach(nLoc => {
    if (isActive(cubes, nLoc)) {
      neighborCount++
    }
  });

  if (isActive(cubes, loc)) {
    const ret = neighborCount == 2 || neighborCount == 3;
    // console.log(`Active with ${neighborCount} nearby: ${ret}`);
    return ret;
  } else {
    const ret = neighborCount == 3;
    // console.log(`Inactive with ${neighborCount} nearby: ${ret}`);
    return ret;
  }
  // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
  // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
}

const activate = (cubes, loc) => {
  cubes.count++;
  // console.log(`Activating ${loc.x},${loc.y},${loc.z}`);
  cubes.active[getKey(loc)] = true;
  if (loc.x < cubes.min.x) {
    cubes.min.x = loc.x
  }
  if (loc.x > cubes.max.x) {
    cubes.max.x = loc.x
  }
  if (loc.y < cubes.min.y) {
    cubes.min.y = loc.y
  }
  if (loc.y > cubes.max.y) {
    cubes.max.y = loc.y
  }
  if (loc.z < cubes.min.z) {
    cubes.min.z = loc.z
  }
  if (loc.z > cubes.max.z) {
    cubes.max.z = loc.z
  }
  if (loc.w < cubes.min.w) {
    cubes.min.w = loc.w
  }
  if (loc.w > cubes.max.w) {
    cubes.max.w = loc.w
  }
}

const initCube = () => {
  return {count:0,min: {x: 0, y:0, z: 0,w:0}, max: {x: 0, y:0, z: 0,w:0}, active:{}};
}

const processNextState = (oldCubes) => {
  const minX = oldCubes.min.x;
  const minY = oldCubes.min.y;
  const minZ = oldCubes.min.z;
  const minW = oldCubes.min.w;
  const maxX = oldCubes.max.x;
  const maxY = oldCubes.max.y;
  const maxZ = oldCubes.max.z;
  const maxW = oldCubes.max.w;

  const newCubes = initCube()

  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      for (let z = minZ - 1; z <= maxZ + 1; z++) {
        for (let w = minW - 1; w <= maxW + 1; w++) {
          const loc = {x,y,z,w};
          if (getNextState(oldCubes, loc)) {
            activate(newCubes, loc);
          }
        }
      }
    }
  }

  // dumpCube(newCubes);
  return newCubes;
}

const parseCubes = (st) => {
  const cubes = initCube()
  for (let y = 0; y < st.length; y++) {
    const line = st[y];
    for (let x = 0; x < line.length; x++) {
      if (line.charAt(x) == "#") {
        activate(cubes, {x,y,z:0,w:0});
      }
    }
  }
// .#.
// ..#
// ###

  return cubes;
}
const dumpCube = (cubes) => {
  console.log("--------------");
  console.log(`min:${JSON.stringify(cubes.min)}, max:${JSON.stringify(cubes.max)}`);
  for (let z = cubes.min.z; z <= cubes.max.z; z++) {
    console.log(`z=${z}`);
    for (let y = cubes.min.y; y <= cubes.max.y; y++) {
      let st = "";
      for (let x = cubes.min.x; x <= cubes.max.x; x++) {
        if (isActive(cubes, {x,y,z})) {
          st += "#"
        } else {
          st += "."
        }
      }
      console.log(st);
    }
    console.log("");
  }
}

const run = () => {
  let st = readStringArrayFromFile("./input/day17.txt", "\n");

  let cubes = parseCubes(st);
  // dumpCube(cubes);
  cubes = processNextState(cubes);
  cubes = processNextState(cubes);
  cubes = processNextState(cubes);
  cubes = processNextState(cubes);
  cubes = processNextState(cubes);
  cubes = processNextState(cubes);

  console.log("ANSWER (Part 1):", cubes.count);
}

module.exports = { run };
