
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const text = 'text.txt';

const ws = fs.createWriteStream(path.join(__dirname, text)).on('error', (err) => console.log(err));
const myInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}).on('error', (err) => console.log(err));

myInterface.question('Write your message, please\n', (str) => {
  if (str === 'exit') myInterface.close();
  else ws.write(`${str}`);
});
myInterface.on('line', (str) => {
  if (str === 'exit') myInterface.close();
  else ws.write(`\n${str}`);
});
myInterface.on('close', () => console.log('Good Luck!'));

myInterface.on('SIGINT', () => {
  console.log('Good Luck!');
  process.exit(0);
});
