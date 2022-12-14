import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { range } from "../../helpers/arrayUtils.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

function countTotalSides(cubes) {
  let totSides = 0;
  cubes.forEach((cube, index) => {
    let sides = 6;
    cube.forEach((axis, aIndex) => {
      for (const [i, cube_] of cubes.entries()) {
        if (i !== index) {
          if (cube_[aIndex] === axis + 1 || cube_[aIndex] === axis - 1) {
            const others = cube.slice();
            others.splice(aIndex, 1);
            const others2 = cube_.slice();
            others2.splice(aIndex, 1);
            if (others.shallowSame(others2)) {
              sides--;
            }
          }
        }
      }
    });
    totSides += sides;
  });
  return totSides;
}

/**
 * MY SOLUTION - WORKS FOR THE TEST INPUT, BUT NOT REAL INPUT
 */
function countTotalSidesOuter(cubes) {
  let totSides = 0;
  cubes.forEach((cube) => {
    const xValues = cubes.filter((c) => c[1] === cube[1] && c[2] === cube[2]).map((c) => c[0]);
    const yValues = cubes.filter((c) => c[0] === cube[0] && c[2] === cube[2]).map((c) => c[1]);
    const zValues = cubes.filter((c) => c[1] === cube[1] && c[0] === cube[0]).map((c) => c[2]);
    totSides +=
      [xValues.min(), xValues.max()].count(cube[0]) +
      [yValues.min(), yValues.max()].count(cube[1]) +
      [zValues.min(), zValues.max()].count(cube[2]);
  });
  return totSides;
}

/**
 * WORKING SOLUTION - COPIED FROM REDDIT SOLUTIONS THREAD
 */
function countOuter2(cubes) {
  cubes = cubes.map(([x, y, z]) => [x + 1, y + 1, z + 1]);
  const maxX = Math.max(...cubes.map((d) => d[0])) + 1;
  const maxY = Math.max(...cubes.map((d) => d[1])) + 1;
  const maxZ = Math.max(...cubes.map((d) => d[2])) + 1;
  const map = range(maxX + 1).map(() =>
    range(maxY + 1).map(() => range(maxZ + 1).map(() => false))
  );
  cubes.forEach(([x, y, z]) => {
    map[x][y][z] = true;
  });

  let sides = 0;
  const transforms = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ];
  const seen = map.map((slice) => slice.map((row) => row.map(() => false)));

  const toExpore = [[0, 0, 0]];
  while (toExpore.length > 0) {
    const [x, y, z] = toExpore.pop();
    if (seen[x][y][z]) {
      continue;
    }

    seen[x][y][z] = true;
    for (const [dx, dy, dz] of transforms) {
      const xp = x + dx;
      const yp = y + dy;
      const zp = z + dz;
      if (xp < 0 || yp < 0 || zp < 0 || xp > maxX || yp > maxY || zp > maxZ) {
        continue;
      }

      if (map[xp][yp][zp]) {
        sides++;
        continue;
      }

      toExpore.push([xp, yp, zp]);
    }
  }

  return sides;
}

const task1 = () => {
  const cubes = lines.splitEachElementBy(",").map((el) => el.toNumber());
  let totSides = countTotalSides(cubes);
  console.log(totSides);
};

const task2 = () => {
  const cubes = lines.splitEachElementBy(",").map((el) => el.toNumber());
  let totSides = countTotalSidesOuter(cubes);
  console.log(totSides);
  totSides = countOuter2(cubes);
  console.log(totSides);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
