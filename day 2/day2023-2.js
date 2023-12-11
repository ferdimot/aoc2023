const fs = require("fs");

fs.readFile("./day 2/input.txt", (err, data) => {
  const inputLines = data.toString().split("\n");

  // part1(inputLines);
  part2(inputLines);
});

function part1(inputLines) {
  console.log("Result", __filename, "part1");

  const games = [];

  inputLines.forEach(line => {
    let gameObject = parseGame(line);
    games.push(gameObject);
  });

  const validGames = findValidGames(games, 12, 13, 14);
  const result = validGames.reduce((prev, curr, idx, arr)=>{
    return prev+curr
  }, 0);

  console.log("solution day 2 part 1", result);
}


function part2(inputLines) {
  let games = [];
  let checkedGames = [];

  inputLines.forEach(line => {
    let gameObject = parseGame(line);
    games.push(gameObject);
  });

  checkedGames = games.map(game => {
    let red = 0;
    let green = 0;
    let blue = 0;

    game.rounds.forEach(round =>{
      if(round.red > red) red = round.red;
      if(round.green > green) green = round.green;
      if(round.blue > blue) blue = round.blue;
    })

    return {id: game.id, red: red, green: green, blue: blue};
  })

  const result = checkedGames.reduce((prev, curr, idx, arr)=>{
    return prev + (curr.red*curr.green*curr.blue);
  }, 0);

  console.log("Result", __filename, "day2 part 2:", result);
}

function parseGame(gameData){
  const parsedGame = {
    id: 0,
    rounds: []
  };

  let game = gameData.split(":");

  parsedGame.id = gameData.match(/(Game )|(\d+)/g)[1];
  let gameRounds = game[1].split(";");

  gameRounds.forEach(gameRound => {
    let parsedGameRound = parseGameRound(gameRound);
    parsedGame.rounds.push(parsedGameRound);
  });

  return parsedGame;
}

function parseGameRound(gameRound){
  let items = gameRound.split(",");
  let itemsCurrRound = {red: 0, blue: 0, green: 0}; // template

  items.forEach(item=>{
    const foundItems= item.trim().match(/\d+|\w+/g);
    let color = foundItems[1];
    let count = parseInt(foundItems[0]);

    itemsCurrRound[color] = count;
  });

  return itemsCurrRound;
}

function findValidGames(parsedGames, red = 0, green = 0, blue = 0){

  const idsOfValidGames = [];

  parsedGames.forEach((game)=>{
    const rounds = game.rounds;
    const gameId = game.id;

    let validGame = true;

    for (let index = 0; index < rounds.length; index++) {
      const roundData = rounds[index];
      if(roundData.red > red || roundData.green > green || roundData.blue > blue) {
        validGame = false;
      }
    }

    if(validGame) idsOfValidGames.push(parseInt(gameId));
  })

  return idsOfValidGames;
}