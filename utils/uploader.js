const { join, extname } = require('path');
const { exists, mkdir } = require('fs');
const { promisify } = require('util')
const multer = require('multer')

async function destPath(resource) {
  const pathName = `${resource}sImage`;
  const fullPath = join(__dirname, '..', 'public', pathName);
  const isExsist = await promisify(exists)(fullPath);
  if (!isExsist) {
    await promisify(mkdir)(fullPath)
    return fullPath;
  }
  return fullPath;
}

async function createUploader(resource, validExtnames = ['.img', '.jpg', '.jpeg']) {
  const fullPath = await destPath(resource);
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, fullPath)
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    },
  })
  const filter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    if (!validExtnames.includes(extname(file.originalname))) {
      return cb(new Error('فرمت فایل وارد شده صحیح نمیباشد'))
    }
    if (fileSize > (1048576 * 3)) {
      return cb(new Error('حجم فایل باید کمتر از ۳ مگابایت باشد'));
    }
    return cb(null, true)

  }
  return multer({
    storage,
    fileFilter: filter,
    limits: { fileSize: 3 * 1024 * 1024 }
  })
}


module.exports = createUploader;

