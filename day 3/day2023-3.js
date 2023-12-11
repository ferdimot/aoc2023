const fs = require("fs");
const { off } = require("process");

fs.readFile("./day 3/input.txt", (err, data) => {
  const inputData = data.toString().split("\n");

  const lineCount = inputData.length;
  const rowCount = inputData[0].length;

  const findallSymbols = new Set();
  for (let lineIdx = 0; lineIdx < inputData.length; lineIdx++) {
    const line = inputData[lineIdx];
    const foundSymbols = findSymbols(line);

    foundSymbols.forEach((symbolFound) => {
      findallSymbols.add(symbolFound[0]);
    });
  }

  console.log(findallSymbols);

  // const map = parseSchematic(inputLines);
  // console.log(map);

  // new start
  const numbersWithAdjacentSymbols = [];

  for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
    const line = inputData[lineIdx];
    const numbersInLine = findNumbers(line);

    const y = lineIdx;

    for (let numberIdx = 0; numberIdx < numbersInLine.length; numberIdx++) {
      const numberData = numbersInLine[numberIdx];
      const number = numberData[0];
      const x = numberData.index;

      const foundSymbol = checkNumberForAdjacentSymbols(
        inputData,
        numberData,
        x,
        y
      );
      if (foundSymbol) {
        numbersWithAdjacentSymbols.push(parseInt(number));
      }
    }
  }

  console.log(
    "result day 3 part1",
    numbersWithAdjacentSymbols.reduce((prev, curr) => prev + curr, 0)
  );
});

function checkNumberForAdjacentSymbols(lines, numberData, x, y) {
  let topRow = false;
  let sameRow = false;
  let bottomRow = false;

  if (y - 1 > 0) topRow = checkTopRow(lines[y - 1], numberData);
  sameRow = checkSameRow(lines[y], numberData);

  if (y + 1 < lines.length)
    bottomRow = checkBottomRow(lines[y + 1], numberData);

  return topRow || sameRow || bottomRow;
}

function checkNeighborRow(line, numberData) {
  const symbols = findSymbols(line);
  const number = numberData[0];
  const numberSize = number.length;

  let result = false;

  if (symbols) {
    for (let symbolIdx = 0; symbolIdx < symbols.length; symbolIdx++) {
      const symbolData = symbols[symbolIdx];
      const symbolX = symbolData.index;

      const numberStartIdx = numberData.index;
      const numberEndIdx = numberData.index + numberSize - 1;

      const rangeFromStart = numberStartIdx - 1;
      const rangeFromEnd = numberEndIdx + 1;
      if (symbolX >= rangeFromStart && symbolX <= rangeFromEnd) {
        result = true;
      }
    }
  }

  return result;
}

function checkSameRow(line, numberData) {
  const number = numberData[0];
  const numberSize = number.length;
  const numberIdx = numberData.index;

  let symbolLeft = false;
  let symbolRight = false;

  // left
  if (numberIdx - 1 > 0 && line[numberIdx - 1] != ".") {
    symbolLeft = true;
  }

  // right
  if (
    numberIdx + numberSize - 1 < line.length &&
    line[numberIdx + numberSize] != "."
  ) {
    symbolRight = true;
  }

  return symbolLeft || symbolRight;
}

function checkTopRow(line, numberData) {
  return checkNeighborRow(line, numberData);
}

function checkBottomRow(line, numberData) {
  return checkNeighborRow(line, numberData);
}

function part1(map) {
  // find a number for each symbol within a distance of 1;
  const allNumbers = [];

  for (let mapIdx = 0; mapIdx < map.length; mapIdx++) {
    const y = mapIdx;
    const line = map[mapIdx];

    for (let lineIdx = 0; lineIdx < line.length; lineIdx++) {
      const x = lineIdx;
      const coordinate = line[lineIdx];
      if (coordinate == undefined) continue;

      if (coordinate instanceof Symbol) {
        const foundNumbers = findAdjacentNumbers(map, x, y);
        allNumbers.push(foundNumbers);
      }
    }
  }

  console.log(allNumbers);
  // console.log("solution day 2 part 1", result);
}

function part2(inputLines) {
  console.log("Result", __filename, "day2 part 2:", result);
}

function parseSchematic(schematicData) {
  console.log("parsing schematic");
  let map = [];

  for (let index = 0; index < schematicData.length; index++) {
    const line = schematicData[index];

    const lineArr = new Array(line.length);
    const data = parseLine(line);

    for (let numberIdx = 0; numberIdx < data.numbers.length; numberIdx++) {
      const numberOccurence = data.numbers[numberIdx];
      const number = numberOccurence[0];
      const numberLength = numberOccurence[0].length;
      for (let digitIdx = 0; digitIdx < numberLength; digitIdx++) {
        lineArr[numberOccurence.index + digitIdx] = new Number(number);
      }
    }

    for (let symbolIdx = 0; symbolIdx < data.symbols.length; symbolIdx++) {
      const symbolOccurence = data.symbols[symbolIdx];
      const symbol = data.symbols[symbolIdx][0];
      lineArr[symbolOccurence.index] = new Symbol(symbol);
    }

    map.push(lineArr);
  }

  return map;
}

function parseLine(line) {
  const simplifiedArr = [];

  const numberArr = findNumbers(line);
  const symbolsArr = findSymbols(line);

  return { numbers: numberArr, symbols: symbolsArr };
}

function findNumbers(inputStr) {
  const numbers = inputStr.matchAll(/\d+/g);
  const numberArr = Array.from(numbers);

  return numberArr;
}

function findSymbols(inputStr) {
  const symbols = inputStr.matchAll(/[^\.\d]/g);
  const symbolsArr = Array.from(symbols);
  return symbolsArr;
}

function findAdjacentNumbers(map, x, y) {
  const foundNumberPositions = [];

  let testX = undefined;
  let testY = undefined;

  let topRow = [];
  let sameRow = [];
  let bottomRow = [];

  // top left
  testX = x - 1;
  testY = y - 1;
  if (testY >= 0 && testX >= 0) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      topRow.push(new Coordinate(testX, testY));
    }
  }
  // top
  testX = x;
  testY = y - 1;
  if (testY > 0) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      topRow.push(new Coordinate(testX, testY));
    }
  }
  // top right
  testX = x + 1;
  testY = y - 1;
  if (testX < map[y].length && testY > 0) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      topRow.push(new Coordinate(testX, testY));
    }
  }

  console.log(topRow);

  // left
  testX = x - 1;
  testY = y;
  if (testX > 0) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      sameRow.push(new Coordinate(testX, testY));
    }
  }

  // right
  testX = x + 1;
  testY = y;
  if (testX < map[y].length) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      sameRow.push(new Coordinate(testX, testY));
    }
  }

  console.log(sameRow);

  // bottom left
  testX = x - 1;
  testY = y + 1;
  if (testX > 0 && testY < map.length) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      bottomRow.push(new Coordinate(testX, testY));
    }
  }

  // bottom
  testX = x;
  testY = y + 1;
  if (testY < map.length) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      bottomRow.push(new Coordinate(testX, testY));
    }
  }

  // bottom right
  testX = x + 1;
  testY = y + 1;
  if (testY < map.length && testX < map[y].length) {
    if (testNumberOnCoordinate(map, testX, testY)) {
      bottomRow.push(new Coordinate(testX, testY));
    }
  }

  console.log(bottomRow);

  return foundNumberPositions;
}

function testNumberOnCoordinate(map, x, y) {
  let foundNumber = false;
  if (map[y][x] instanceof Number) {
    foundNumber = true;
  }
  return foundNumber;
}

class Symbol {
  char = "";
  constructor(char) {
    this.char = char;
  }
}

class Coordinate {
  initialized = false;
  x = 0;
  y = 0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.initialized = true;
  }
}
