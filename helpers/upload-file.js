const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtensions, folder = '') => {
    return new Promise((resolve, reject) => {
        const {file} = files;
        const nameArray = file.name.split('.');
        const extension = nameArray[nameArray.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(`Not valid extension ${extension} - allowed extensions [${validExtensions}]`);
        }

        const tempFileName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempFileName);

        file.mv(uploadPath, (err) => {
          if (err) {
            return reject(err);
          }

          resolve(tempFileName);
        });
    });
}

module.exports = {
    uploadFile
}