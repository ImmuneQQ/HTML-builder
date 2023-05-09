const path = require('node:path');
const { readdir, mkdir, copyFile, unlink } = require('node:fs/promises');

async function copyDir(pathToDir, dir) {
  await mkdir(path.join(pathToDir, `${dir}-copy`), { recursive: true });

  const oldFiles = await readdir(path.join(pathToDir, `${dir}-copy`), {
    withFileTypes: true,
  });
  for (let file of oldFiles) {
    if (file.isFile()) {
      await unlink(
        path.join(pathToDir, `${dir}-copy`, file.name)
      );
    }
  }

  const files = await readdir(path.join(pathToDir, dir), {
    withFileTypes: true,
  });
  for (let file of files) {
    if (file.isFile()) {
      await copyFile(
        path.join(pathToDir, dir, file.name),
        path.join(pathToDir, `${dir}-copy`, file.name)
      );
    }
  }
}

copyDir(__dirname, 'files');
