const path = require('node:path');
const {readdir} = require('node:fs/promises');
const {stat} = require('node:fs');
const {stdout} = process;
const files = readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});

files.then((result) => {
  result.forEach(file => {
    if (file.isFile()) {
      const fullFileName = file.name;
      const extFile = path.extname(fullFileName);
      const fileName = path.basename(fullFileName, extFile);
      stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
        stdout.write(`${fileName} - ${extFile.slice(1)} - ${stats.size }b\n`);
      });
    }
  });
});
