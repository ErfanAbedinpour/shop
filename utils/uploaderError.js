const multer = require('multer');
const path = require('path')

const uploaderErrorHandler = (validations, uploader) => (req, res, next) => {
  const validateExt = ['.img', '.jpg', '.jpeg', '.png']
  uploader(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        req.flash('errors', [{ msg: "تعداد عکس برای کالا نمیتواند بیشتراز ۴ تا باشد" }])
        return res.redirect(req.originalUrl)
      }
    }
    if (Object.keys(req.files).length < 2) {
      req.flash('errors', [{ msg: "لطفا حداقل یک فایل برای تایتل و کالا اپلود کنید" }])
      return res.status(400).redirect(req.originalUrl)
    }
    for (const img of req.files.titleImage) {
      if (!validateExt.includes(path.extname(img.originalname))) {
        req.flash("errors", [{
          msg: ` ${img.originalname} .png .jpeg .jpg .img فرمت های معتبر`
        }])
        return res.redirect(req.originalUrl);
      }
    }
    for (const img of req.files.images) {
      if (!validateExt.includes(path.extname(img.originalname))) {
        req.flash("errors", [{
          msg: ` ${img.originalname} .png .jpeg .jpg .img فرمت های معتبر`
        }])
        return res.redirect(req.originalUrl);
      }
    }
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        req.flash('errors', result.array())
        return res.status(400).redirect(req.originalUrl)
      }
    }
    next()
  })
}

module.exports = uploaderErrorHandler
