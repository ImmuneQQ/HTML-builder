const path = require('node:path');
const fs = require('node:fs');
const { readdir, readFile, mkdir, copyFile } = require('node:fs/promises');

async function replaceTemplates(pathToTemplate, pathToComponents, newPath) {
  const writableStream = fs.createWriteStream(newPath);
  let template = await readFile(pathToTemplate, { encoding: 'utf-8' });
  const components = await readdir(pathToComponents, { withFileTypes: true });

  let templates = new Map();
  for (const component of components) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const componentContent = await readFile(
        path.join(pathToComponents, component.name),
        { encoding: 'utf-8' }
      );
      templates.set(component.name, componentContent);
    }
  }
  const templatesVariables = template.match(/{{.+?}}/g);
  for (const templatesVariable of templatesVariables) {
    template = template.replace(
      templatesVariable,
      templates.get(`${templatesVariable.slice(2, -2)}.html`)
    );
  }

  writableStream.write(template);
}

async function mergeStyles(pathToDir, newPathToDir) {
  await mkdir(newPathToDir, { recursive: true });

  const writableStream = fs.createWriteStream(
    path.join(newPathToDir, 'style.css')
  );
  const files = await readdir(pathToDir, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(path.join(pathToDir, file.name));
      input.pipe(writableStream);
    }
  });
}

async function copyDir(pathToDir, newPathToDir) {
  await mkdir(newPathToDir, { recursive: true });

  const files = await readdir(pathToDir, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile()) {
      copyFile(
        path.join(pathToDir, file.name),
        path.join(newPathToDir, file.name)
      );
    } else {
      copyDir(
        path.join(pathToDir, file.name),
        path.join(newPathToDir, file.name)
      );
    }
  });
}

async function build() {
  await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  replaceTemplates(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    path.join(__dirname, 'project-dist', 'index.html')
  );
  mergeStyles(
    path.join(__dirname, 'styles'),
    path.join(__dirname, 'project-dist')
  );
  copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
}

build();
