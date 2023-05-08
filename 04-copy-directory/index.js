const fs = require('fs');
const path = require('path');

fs.access(path.join(__dirname, 'files-copy'), function(error){
    if (error) {
        fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            copyFiles();
        });
    } else {
        fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
            if (err) throw err;
            for (const file of files) {
              fs.unlink(path.join(__dirname, 'files-copy', file), err => {
                if (err) throw err;
              });
            }
          });
        copyFiles();
    }
});
fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) {
        return console.error(err);
    }
    copyFiles();
});

function copyFiles() {
    fs.readdir(path.join(__dirname, 'files'), (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
            fs.copyFile(
                path.join(__dirname, 'files', file),
                path.join(__dirname, 'files-copy', file),
            (err) => {
                if (err) {
                    return console.error(err);
                }
          })
        })
        }
      })
  }

