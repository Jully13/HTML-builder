const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist');

const ws = fs.createWriteStream(path.join(pathToBundle, 'bundle.css'));

fs.readdir(pathToStyles, { withFileTypes: true }, (error, files) => {
    if (error) console.error(error);
    else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(path.join(pathToStyles, file.name)) === '.css') {
          const rs = fs.createReadStream(path.join(pathToStyles, file.name), { encoding: 'UTF-8'});
          rs.pipe(ws);
        }
      });
    }
  });