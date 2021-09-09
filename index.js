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

// print standard output
const printOutput = (color) => {
  console.log(colorOutput.hex(color)('###############################'));
  console.log(colorOutput.hex(color)('###############################'));
  console.log(colorOutput.hex(color)('###############################'));
  console.log(colorOutput.hex(color)('#####                     #####'));
  console.log(colorOutput.hex(color)(`#####       ${color}       #####`));
  console.log(colorOutput.hex(color)('#####                     #####'));
  console.log(colorOutput.hex(color)('###############################'));
  console.log(colorOutput.hex(color)('###############################'));
  console.log(colorOutput.hex(color)('###############################'));
};

// ask user for color details, return color details
const createCustomColor = () => {
  const choiceQuestion =
    'Do you want to generate or pick a color? Type "generate" or "pick": ';
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
      const hueAnswer = await question(hueQuestion);
      const luminosityAnswer = await question(luminosityQuestion);
      if (
        hueList.includes(hueAnswer) &&
        luminosityList.includes(luminosityAnswer)
      ) {
        printOutput(getColor(luminosityAnswer, hueAnswer));
      } else {
        console.log(
          'This option was not provided, have a random color instead: ',
        );
        printOutput(getColor());
      }
    }
    rl.close();
  })();
};

if (inputOne && inputTwo) {
  if (luminosityList.includes(inputOne) && hueList.includes(inputTwo)) {
    printOutput(getColor(inputOne, inputTwo));
  } else if (luminosityList.includes(inputTwo) && hueList.includes(inputOne)) {
    printOutput(getColor(inputTwo, inputOne));
  } else {
    console.log('These arguments do not exist, but here is a random color: ');
    printOutput(getColor());
  }
} else if (inputOne) {
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
