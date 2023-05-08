const fs = require('fs');
const path = require('path');

myPath = path.join(__dirname, 'secret-folder');

fs.readdir(myPath, {withFileTypes: true}, (error, dirEntryList) => {
  if (!error) {
    dirEntryList.forEach((dirEntry) => {
      if (dirEntry.isFile()) {
        const pathFile = path.join(__dirname, 'secret-folder', dirEntry.name)
        fs.stat(pathFile, function (error, stats) {
          if (error) {
            console.error(error);
        } else {
            const [name, ext] = [...dirEntry.name.split('.')];
            console.log(`${name} - ${ext} - ${stats.size} bytes`);
          }
        })
      }
    })
  } else {
      console.error(error);
    }
})
