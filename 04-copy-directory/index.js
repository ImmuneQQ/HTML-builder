const path = require('node:path');
const {readdir, mkdir, copyFile} = require('node:fs/promises');

function copyDir(pathToDir, dir) {
  mkdir(path.join(pathToDir, `${dir}-copy`), {recursive: true});
  const files = readdir(path.join(pathToDir, dir), {withFileTypes: true});

  files.then((result) => {
    result.forEach(file => {
      if (file.isFile()) {
        copyFile(path.join(pathToDir, dir, file.name), path.join(pathToDir, `${dir}-copy`, file.name));
      }
    });
  });
}

copyDir(__dirname, 'files');
