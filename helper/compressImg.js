const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const createDirectory = function(resourceName) {
  const fullPath = path.join(__dirname, '..', 'public', resourceName);
  if (fs.existsSync(fullPath)) {
    return fullPath
  }
  fs.mkdirSync(fullPath)
  isFileExsist = true;
  return fullPath
}

function compressImg(img, foldername) {
  return new Promise((resolve, reject) => {
    const type = img.fieldname;
    const fullPath = createDirectory(foldername)
    const uniquName = img.originalname + '-' + Math.round((Math.random()) * Date.now() * 1e4) + path.extname(img.originalname);
    sharp(img.buffer)
      .resize(500, 600)
      .flatten({
        background: { r: 128, g: 128, b: 128 }
      })
      .toFile(path.join(fullPath, uniquName))
      .then((data) => {
        data.filename = uniquName;
        data.type = type;
        resolve(data);
      }).catch(err => {
        reject(err)
      })
  })
}

module.exports = compressImg
