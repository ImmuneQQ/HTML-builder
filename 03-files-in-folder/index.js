const path = require('node:path');
const {readdir} = require('node:fs/promises');
const {stat} = require('node:fs');
const {stdout} = process;

async function filesInFolder(folder) {
  const files = await readdir(folder, {withFileTypes: true});

  files.forEach(file => {
    if (file.isFile()) {
      const fullFileName = file.name;
      const extFile = path.extname(fullFileName);
      const fileName = path.basename(fullFileName, extFile);
      stat(path.join(folder, file.name), (error, stats) => {
        stdout.write(`${fileName} - ${extFile.slice(1)} - ${stats.size}b\n`);
      });
    }
  });
}

filesInFolder(path.join(__dirname, 'secret-folder'));
