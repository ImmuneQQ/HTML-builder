const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Enter text\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  writableStream.write(data);
});

process.on('SIGINT', () => {
  exit();
});
process.on('exit', () => {
  stdout.write('Goodbye!');
});
