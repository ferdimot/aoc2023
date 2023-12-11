const fs = require("fs");

fs.readFile("./day 1/input.txt", (err, data) => {
  const inputLines = data.toString().split("\n");

  // part1(inputLines);
  part2(inputLines);
});

function part1(inputLines) {
  console.log("Result", __filename, "part1");

  const resultArray = [];

  inputLines.forEach((line) => {
    const result = line.match(/\d/g);

    const firstDigit = result[0]
    const lastDigit = result[result.length-1];
    
    if(result.length > 1){
      const digits = transformToTwoDigitNumber(firstDigit, lastDigit);
      resultArray.push(digits);
    }else{
      resultArray.push(transformToTwoDigitNumber(firstDigit, firstDigit));
    }
  });

  // build sum
  const sum = resultArray.reduce((prev,curr,idx,arr)=>{
    return prev+curr;
  }, 0);

  console.log(`sum of ${resultArray.length} items: ${sum}`);
}

/**
 * Somehow in here is a bug
 * @param {String} inputLines 
 */

function part2(inputLines) {

  const resultArray = [];

  inputLines.forEach(line =>{
    let result = findNums(line);

    mappedResult = result.map((val,idx,arr)=>{
      return transformWrittenDigit(val);
    });

    const firstDigit = mappedResult[0]
    const lastDigit = mappedResult[mappedResult.length-1];
    
    const digits = transformToTwoDigitNumber(firstDigit, lastDigit);
    resultArray.push(digits);
    });

  console.log(resultArray);

  // build sum
  const sum = resultArray.reduce((prev,curr,idx,arr)=>{
    return prev+curr;
  }, 0);


  console.log("Result", __filename, "part2:", `sum of all ${resultArray.length} items`, sum);
}

function transformWrittenDigit(value){
  let result = value;
  switch(value){
    case "one":
      result = "1";
      break;
    case "two":
      result = "2";
      break;
    case "three":
      result = "3";
      break;
    case "four":
      result = "4";
      break;
    case "five":
      result = '5';
      break;
    case "six":
      result = "6";
      break;
    case "seven":
      result = "7";
      break;
    case "eight":
      result = "8";
      break;
    case "nine":
      result = "9";
      break;
  }

  return result;
}

function findNums(line){
  const foundNums = [];
  let modifiedLine = line;

  let regex = new RegExp(/\d|one|two|three|four|five|six|seven|eight|nine/g)
  let wordRex = new RegExp(/one|two|three|four|five|six|seven|eight|nine/g);
  while(true){
    let tempResult = modifiedLine.match(regex);
    if(!tempResult || tempResult.length == 0) break;

    foundNums.push(tempResult[0]);
    if(wordRex.test(tempResult[0])){
      modifiedLine = modifiedLine.slice(tempResult[0].length-1);
    }else{
      modifiedLine = modifiedLine.slice(tempResult[0].length);
    }
  }
  
  return foundNums;
}

function transformToTwoDigitNumber(firstDigit, lastDigit){
  return parseInt(`${firstDigit}${lastDigit}`);
}