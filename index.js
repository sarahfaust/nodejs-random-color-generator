const randomColor = require('randomcolor');
const colorOutput = require('chalk');
const readline = require('node:readline');

const hueList = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'monochrome',
];

const luminosityList = ['light', 'bright', 'dark'];

// get cli input
const inputOne = process.argv[2];
const inputTwo = process.argv[3];

// get a random or specific color
const getColor = (luminosity, hue) => {
  return randomColor({
    luminosity: luminosity,
    hue: hue,
  });
};

let outputWidth = 31;
let outputHeight = 9;

const printFullLine = (lineWidth, lineColor, symbol) => {
  console.log(colorOutput.hex(lineColor)(symbol.repeat(lineWidth)));
};

const printSpaceLine = (sides, space, lineColor) => {
  console.log(
    colorOutput.hex(lineColor)(
      '#'.repeat(sides) + ' '.repeat(space) + '#'.repeat(sides),
    ),
  );
};

const printColorLine = (sides, space, lineColor, rest) => {
  console.log(
    colorOutput.hex(lineColor)(
      '#'.repeat(sides) +
        ' '.repeat(space) +
        `${lineColor}` +
        ' '.repeat(space) +
        ' '.repeat(rest) +
        '#'.repeat(sides),
    ),
  );
};

// calculate size and print output
const printOutput = (color) => {
  const heightRest = outputHeight % 3;
  const lines = Math.floor(outputHeight / 3);
  const sidesWidth = Math.floor(outputWidth / 6);
  const spaceWidth = outputWidth - sidesWidth * 2;
  const spaceAroundColor = outputWidth - sidesWidth * 2 - 7;
  const dividedLines = Math.floor(lines / 2);
  const widthRest = spaceAroundColor % 2;

  const underscore = '_';
  const overscore = '‾';
  const hash = '#';

  // CASE 1: lineblocks are even and rest is two (= two lines are missing because of flooring)
  // SOLUTION: print half line at beginning and end and color display line
  // these two lines will compensate for the missing ones
  // test with 11
  if (lines % 2 === 0 && heightRest === 2) {
    printFullLine(outputWidth, color, underscore);
    for (let i = 0; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }

    printColorLine(sidesWidth, spaceAroundColor / 2, color, widthRest);

    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }
    for (let i = 0; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
    printFullLine(outputWidth, color, overscore);
  }

  // CASE 2: lineblocks are even, but there is no rest
  // there will one line too much when the color display line is included
  // SOLUTION: print one line less in beginning and ending block and
  // print half lines at the beginning and end instead
  else if (lines % 2 === 0 && heightRest === 0) {
    printFullLine(outputWidth, color, underscore);
    for (let i = 1; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }

    printColorLine(sidesWidth, spaceAroundColor / 2, color, widthRest);

    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }
    for (let i = 1; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
    printFullLine(outputWidth, color, overscore);
  }

  // CASE 3: linesblocks are uneven anyway, no problem! :)
  else {
    for (let i = 0; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }

    printColorLine(sidesWidth, spaceAroundColor / 2, color, widthRest);

    for (let i = 0; i < dividedLines; i++) {
      printSpaceLine(sidesWidth, spaceWidth, color);
    }
    for (let i = 0; i < lines; i++) {
      printFullLine(outputWidth, color, hash);
    }
  }
};

// ask user for color details
// check if arguments by the user are valid
// if they are, save answers where necessary
// and print output accordingly
// otherwise, print random color
const createCustomColor = () => {
  const choiceQuestion =
    'Do you want to generate or pick a color? Type "generate" or "pick": ';
  const formatQuestion =
    'Choose a width and height for your output (WWxHH, at least 09x03): ';
  const hueQuestion =
    'What hue should your color be? Choose "red" or "blue", for example: ';
  const luminosityQuestion =
    'Choose the luminosity. Your options are "bright", "light" or "dark": ';

  // read terminal input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  (async () => {
    const choiceAnswer = await question(choiceQuestion);
    if (choiceAnswer === 'generate') {
      printOutput(getColor());
    } else if (choiceAnswer === 'pick') {
      const formatAnswer = await question(formatQuestion);
      const hueAnswer = await question(hueQuestion);
      const luminosityAnswer = await question(luminosityQuestion);

      // check width and height with regex
      if (formatAnswer.match(/([0-9]{2})x([0-9]{2})/)) {
        outputWidth = parseInt(formatAnswer.slice(0, 2));
        outputHeight = parseInt(formatAnswer.slice(3));

        console.log(outputWidth);
        console.log(outputHeight);

        // check if string was correctly converted to number
        if (!isNaN(outputWidth) || !isNaN(outputHeight)) {
          if (
            // check if hue and value are valid
            hueList.includes(hueAnswer) &&
            luminosityList.includes(luminosityAnswer)
          ) {
            printOutput(getColor(luminosityAnswer, hueAnswer));
          } else {
            outputWidth = 31;
            outputHeight = 9;
            console.log(
              'This option was not provided, have a random color instead: ',
            );
            printOutput(getColor());
          }
        }
      } else {
        console.log(
          'This is not a valid size, please enter height and width correctly the next time.',
        );
        console.log('For now, have a random color: ');
        printOutput(getColor());
      }
    }
    rl.close();
  })();
};

// checking if the user inputs are valid
// print if they are
// print random color if they are not
// CASE 1: two arguments (sequence does not matter)
if (inputOne && inputTwo) {
  if (luminosityList.includes(inputOne) && hueList.includes(inputTwo)) {
    printOutput(getColor(inputOne, inputTwo));
  } else if (luminosityList.includes(inputTwo) && hueList.includes(inputOne)) {
    printOutput(getColor(inputTwo, inputOne));
  } else {
    console.log('These arguments do not exist, but here is a random color: ');
    printOutput(getColor());
  }
}
// CASE 2: one argument
else if (inputOne) {
  if (inputOne === 'ask') {
    createCustomColor();
  } else if (hueList.includes(inputOne.toLowerCase())) {
    printOutput(getColor(0, inputOne));
  } else if (luminosityList.includes(inputOne.toLowerCase())) {
    printOutput(getColor(inputOne, 0));
  } else {
    console.log('This argument does not exist, but here is a random color: ');
    printOutput(getColor());
  }
} else {
  printOutput(getColor());
}
