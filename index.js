const randomColor = require('randomcolor');
const colorOutput = require('chalk');

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

const getColor = (luminosity, hue) => {
  return randomColor({
    luminosity: luminosity,
    hue: hue,
  });
};

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

if (process.argv[2] && process.argv[3]) {
  if (
    luminosityList.includes(process.argv[2]) &&
    hueList.includes(process.argv[3])
  ) {
    printOutput(getColor(process.argv[2], process.argv[3]));
  } else if (
    luminosityList.includes(process.argv[3]) &&
    hueList.includes(process.argv[2])
  ) {
    printOutput(getColor(process.argv[3], process.argv[2]));
  } else {
    console.log('one or both arguments do not exist');
  }
} else if (process.argv[2]) {
  if (hueList.includes(process.argv[2].toLowerCase())) {
    printOutput(getColor(0, process.argv[2]));
  } else if (luminosityList.includes(process.argv[2].toLowerCase())) {
    printOutput(getColor(process.argv[2], 0));
  } else {
    console.log('argument does not exist');
  }
} else {
  printOutput(randomColor());
}

/* const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pickColor = () => {
  readline.question(
    'What hue should your color be? Choose RED or BLUE, for example: ',
    (hue) => {
      console.log(hue);
      readline.question(
        'Choose the luminosity. Your options are BRIGHT, LIGHT or DARK: ',
        (luminosity) => {
          console.log(luminosity);
        },
      );
      readline.close();
    },
  );
};

readline.question(
  'Do you want to generate or pick a color? Type GENERATE of PICK: ',
  (choice) => {
    console.log('Wise choice!');
  switch (choice) {
    case "GENERATE":
      console.log(randomColor());
      break;
    case "PICK":
      pickColor();
      break;
    default:
      console.log("The option was not provided.");
      break;
  }
    readline.close();
    if (choice === 'GENERATE') {
      console.log(randomColor());
    } else if (choice === 'PICK') {
      pickColor();
    } else {
      console.log('The option was not provided.');
    }
  },
); */
