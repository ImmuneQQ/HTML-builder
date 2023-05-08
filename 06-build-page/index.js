const path = require('node:path');
const fs = require('node:fs');
const {readdir, mkdir, copyFile} = require('node:fs/promises');

function copyDir(pathToDir, newPathToDir) {
  mkdir(newPathToDir, {recursive: true});

  const files = readdir(pathToDir, {withFileTypes: true});

  files.then((result) => {
    result.forEach(file => {
      if (file.isFile()) {
        copyFile(path.join(pathToDir, file.name), path.join(newPathToDir, file.name));
      }
      else {
        copyDir(path.join(pathToDir, file.name), path.join(newPathToDir, file.name));
      }
    });
  });
}

function mergeStyles(pathToDir, newPathToDir) {
  mkdir(newPathToDir, {recursive: true});

  const writableStream = fs.createWriteStream(path.join(newPathToDir, 'bundle.css'));
  const files = readdir(pathToDir, {withFileTypes: true});

  files.then((result) => {
    result.forEach(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        console.log(file);
        const input = fs.createReadStream(path.join(pathToDir, file.name));
        input.pipe(writableStream);
      }
    });
  });
}

mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
mergeStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'styles'));
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
