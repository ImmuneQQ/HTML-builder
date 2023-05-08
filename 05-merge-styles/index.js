const path = require('node:path');
const fs = require('node:fs');
const {readdir} = require('node:fs/promises');
const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

const files = readdir(path.join(__dirname, 'styles'), {withFileTypes: true});

files.then((result) => {
  result.forEach(file => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(path.join(__dirname, 'styles', file.name));
      input.pipe(writableStream);
    }
  });
});
