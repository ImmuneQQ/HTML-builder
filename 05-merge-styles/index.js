const path = require('node:path');
const fs = require('node:fs');
const {readdir} = require('node:fs/promises');
const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function mergeStyles() {
  const files = await readdir(path.join(__dirname, 'styles'), {withFileTypes: true});

  files.forEach(file => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(path.join(__dirname, 'styles', file.name));
      input.pipe(writableStream);
    }
  });
}

mergeStyles();
