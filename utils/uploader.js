const { join, extname } = require('path');
const { existsSync, mkdirSync } = require('fs');
const { diskStorage } = require('multer')

function destPath(resource) {
  const pathName = `${resource}sImage`;
  const fullPath = join(__dirname, '..', 'public', pathName);
  const isExsist = existsSync(fullPath)
  if (!isExsist) {
    mkdirSync(fullPath)
    return fullPath;
  }
  return fullPath;
}

function createUploader(resource, validExtnames = ['.img', '.jpg', '.jpeg']) {
  const path = destPath(resource)
  const storage = diskStorage({
    destination: function(_, __, cb) {
      cb(null, path)
    },
    filename: function(_, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extName = extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + `${extName}`);
    },
  })
  const filter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    if (!validExtnames.includes(extname(file.originalname))) {
      return cb(new Error(`فرمت فایل وارد شده صحیح نمیباشد ${file.originalname}`), false)
    }
    if (fileSize > (1048576 * 3)) {
      return cb(new Error('حجم فایل باید کمتر از ۳ مگابایت باشد'), false);
    }
    return cb(null, true)
  }
  return {
    storage,
    fileFilter: filter,
    limit: { fileSize: (3 * 1024 * 1024) }
  }
}

module.exports = createUploader;

