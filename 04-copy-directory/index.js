const path = require('node:path');
const { readdir, mkdir, copyFile } = require('node:fs/promises');

async function copyDir(pathToDir, dir) {
  await mkdir(path.join(pathToDir, `${dir}-copy`), { recursive: true });
  const files = await readdir(path.join(pathToDir, dir), {
    withFileTypes: true,
  });

  files.forEach((file) => {
    if (file.isFile()) {
      copyFile(
        path.join(pathToDir, dir, file.name),
        path.join(pathToDir, `${dir}-copy`, file.name)
      );
    }
  });
}

copyDir(__dirname, 'files');
