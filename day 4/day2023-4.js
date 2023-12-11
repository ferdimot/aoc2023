const fs = require("fs");

const useTestInput = false;
const inputFile = useTestInput ? "test_input.txt" : "input.txt";

fs.readFile(`./day 4/${inputFile}`, (err, data) => {
  const inputData = data.toString().split("\n");
  const scratchcards = inputData.map((card) => card.split("|"));

  part1(scratchcards);
  part2(scratchcards);
});

function part1(input) {
  let pointsForAllScratchcards = 0;

  for (let index = 0; index < input.length; index++) {
    const game = input[index];
    const numberRegex = /\d+/g;

    const winningNumbers = game[0].split(":")[1].match(numberRegex);
    const playerNumbers = game[1].match(numberRegex);
    const winningNumberSet = new Set(winningNumbers);

    let pointsForGame = 0;

    playerNumbers.forEach((number) => {
      if (winningNumberSet.has(number)) {
        if (pointsForGame == 0) {
          pointsForGame = 1;
        } else {
          pointsForGame *= 2;
        }
      }
    });

    pointsForAllScratchcards += pointsForGame;
  }

  console.log("part1 - points for scratchcards:", pointsForAllScratchcards);
}

function part2(input) {
  const scratchcardsPile = new Map();

  for (let game = 0; game < input.length; game++) {
    const gameData = input[game];
    const parsedGame = parseGameAndMatchingNumsResult(gameData);
    scratchcardsPile.set(game, [parsedGame]);
  }

  for (let game = 0; game < input.length; game++) {
    const scratchCardsForRound = scratchcardsPile.get(game);
    const matchingNumbersForGame = scratchCardsForRound[0];

    scratchCardsForRound.forEach((value) => {
      for (let copy = 1; copy <= matchingNumbersForGame; copy++) {
        if (game + copy >= input.length) break;

        const scratchCardsForRoundAfter = scratchcardsPile.get(game + copy);
        scratchCardsForRoundAfter.push(scratchCardsForRoundAfter[0]);
      }
    });
  }

  const allScratchcards = scratchcardsPile.values();

  let scratchcardsCount = 0;
  let nextArr = allScratchcards.next();
  while (nextArr.done == false) {
    const scratchCardForRound = nextArr.value;
    scratchcardsCount += scratchCardForRound.length;
    nextArr = allScratchcards.next();
  }

  console.log("part2 - all scratchcards", scratchcardsCount);
}

function parseGameAndMatchingNumsResult(game) {
  const numberRegex = /\d+/g;

  const winningNumbers = game[0].split(":")[1].match(numberRegex);
  const playerNumbers = game[1].match(numberRegex);
  const winningNumberSet = new Set(winningNumbers);

  let matchingNumbers = 0;
  playerNumbers.forEach((number) => {
    if (winningNumberSet.has(number)) matchingNumbers++;
  });

  return matchingNumbers;
}
