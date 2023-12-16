const fs = require("fs");

fs.readFile("./day 5/test_input.txt", (err, data) => {
  const inputLines = data.toString().split("\n");
  numberRegex = /\d+/g;

  console.log(inputLines);
  // cluster each mapping rules
  const almanach = new Map();

  let itemIdx = 0;
  let tempMapArr = [];
  let mapName = undefined;

  while (itemIdx <= inputLines.length) {
    if (itemIdx == inputLines.length) {
      // final mapping rule, exit while-loop
      addToAlmanach();
      break;
    }

    let inputItem = inputLines[itemIdx];

    if (inputItem == "") {
      // last mapping rules ended
      addToAlmanach();
    } else {
      if (itemIdx == 0) {
        // seed input
        const seedInput = parseSeeds(inputItem);
        mapName = "seeds";
        tempMapArr.push(seedInput);
      } else {
        if (mapName) {
          const range = parseMapRule(inputItem);
          tempMapArr.push(range);
        }

        // map rule input
        if (tempMapArr.length == 0 && !mapName) {
          mapName = inputItem.split(":")[0];
        }
      }
    }

    itemIdx++;
  }

  part1(almanach);

  function addToAlmanach() {
    const mergedMap = tempMapArr;
    almanach.set(mapName, mergedMap);
    tempMapArr = [];
    mapName = undefined;
  }
});

/**
 *
 * @param {Map} almanach
 */
function part1(almanach) {
  // lookup in chain for seed - soil - fertilizer - water - light - temp - humidity - location
  /**
   * @param seeds {Map}
   */
  const seeds = almanach.get("seeds")[0];

  let startLocation = Number.POSITIVE_INFINITY;
  seeds.forEach((seed) => {
    let location = getLocation(seed, almanach);
    if (location < startLocation) startLocation = location;
  });

  console.log("start location:", startLocation);
}

function part2(inputLines) {}

function parseSeeds(inputString) {
  const seeds = parseWithRegex(inputString, numberRegex);
  return seeds.map((value) => Number(value));
}
/**
 *
 * @param {string} inputString
 * @returns Map
 */
function parseMapRule(inputString) {
  const rangeForMap = parseWithRegex(inputString, numberRegex);

  const srcRangeStart = Number(rangeForMap[1]);
  const destRangeStart = Number(rangeForMap[0]);
  const rangeLength = Number(rangeForMap[2]);

  return new MappedRange(srcRangeStart, destRangeStart, rangeLength);
}

/**
 *
 * @param {string} inputString
 * @throws Exception
 * @returns Array<string>
 */
function parseWithRegex(inputString, regex) {
  if (!regex)
    throw new Error("missing regex in parseSeeds(inputString, regex)");
  return regex ? inputString.match(regex) : [];
}

/**
 *
 * @param {Number} seed
 * @param {Map} almanach
 */
function getLocation(seed, almanach) {
  const almanachKeys = Array.from(almanach.keys());

  let result = seed;

  almanachKeys.forEach((key) => {
    if (key == "seeds") return;
    const currentMapRanges = almanach.get(key);
    for (let index = 0; index < currentMapRanges.length; index++) {
      const mapRange = currentMapRanges[index];
      if (mapRange instanceof MappedRange && mapRange.itemInRange(result)) {
        result = mapRange.destinationForSrc(result);
        break;
      }
    }
  });

  return result;
}

class MappedRange {
  srcStart = 0;
  destStart = 0;
  range = 0;

  offset = 0;
  /**
   *
   * @param {Number} src
   * @param {Number} dest
   * @param {Number} range
   */
  constructor(src, dest, range) {
    this.srcStart = src;
    this.destStart = dest;
    this.range = range;

    this.offset = dest - src;
  }

  itemInRange(srcNumber) {
    let result = false;
    const rangeStart = this.srcStart;
    const rangeEnd = this.srcStart + this.range - 1;
    if (srcNumber >= rangeStart && srcNumber <= rangeEnd) result = true;
    return result;
  }

  destinationForSrc(srcNumber) {
    return srcNumber + this.offset;
  }
}
