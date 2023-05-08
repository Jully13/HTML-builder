const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');
const pathToAssets = path.join(__dirname, 'assets');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToBundle = path.join(__dirname, 'project-dist');

const checkFolderAccess = async (folder) => {
  let access = false;
  await fs.access(folder, async (error) => {
    if (!error) access = true;
        else access = false;
  });
  return access;
};

const createNewFolder = async (folder) => {
  if (await checkFolderAccess(folder)) {
    await fs.promises.rm(folder, { recursive: true });
  }
  await fs.promises.mkdir(folder, { recursive: true });
  return true;
};

const copyFiles = async (currentFolder, newFolder, fileName) => {
  await fs.copyFile(
    path.join(currentFolder, fileName),
    path.join(newFolder, fileName),
    function (error) {
        if (error) console.error(error);
    },
  );
};

const bundleStyles = async (currentFolder, newFolder) => {
    const ws = await fs.createWriteStream(newFolder);
    let files = await fs.promises.readdir(currentFolder, { withFileTypes: true });
    files = files.reverse();
    for (let file of files) {
      if (file.isFile() && path.extname(path.join(pathToStyles, file.name)) === '.css') {
        const rs = fs.createReadStream(path.join(pathToStyles, file.name), { encoding: 'UTF-8'});
          rs.pipe(ws);
      }
    }
  };

const bundleAccets = async (currentFolder, newFolder) => {
    const files = await fs.promises.readdir(currentFolder, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) copyFiles(currentFolder, newFolder, file.name);
      else {
        if (await createNewFolder(path.join(pathToAssets, file.name))) {
            bundleAccets(
            path.join(currentFolder, file.name),
            path.join(newFolder, file.name),
          );
        }
      }
    }
};

const bundleLayout = async () => {
    await fs.readFile(pathToTemplate, 'utf-8', (error, data) => {
      if (error) console.error(error);
      let htmlToChange = data;
      let regex = /{{[\s\S]+?}}/g;
      const tagsNames = htmlToChange.match(regex);
      for (let tag of tagsNames) {
        const tagPath = path.join(pathToComponents, tag.slice(2, -2) + '.html');
        fs.readFile(tagPath, 'utf-8', (error, tagHtml) => {
          if (error) console.error(error);
          if (htmlToChange.includes(tag)) {
            htmlToChange = htmlToChange.replace(tag, tagHtml);
            fs.writeFile(
              path.join(pathToBundle, 'index.html'),
              htmlToChange,
              (error) => {
                if (error) console.error(error);
              },
            );
          }
        });
      }
    });
};

function createProjectDist() {
    createNewFolder(pathToBundle);
    createNewFolder(pathToAssets);
    createDist();
}

async function createDist() {
  bundleLayout();
  bundleAccets(path.join(__dirname, 'assets'), pathToAssets);
  if (await createNewFolder(pathToBundle)) {
    bundleStyles(pathToStyles, path.join(pathToBundle, 'style.css'));
  }
}

createProjectDist();
