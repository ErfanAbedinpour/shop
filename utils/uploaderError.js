const multer = require('multer');
const path = require('path');
const { redirect } = require('../helper/redirect');


const uploaderErrorHandler = (validations, uploader) => (req, res, next) => {
  const validateExt = ['.img', '.jpg', '.jpeg', '.png']
  uploader(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        req.flash('errors', [{ msg: "تعداد عکس برای کالا نمیتواند بیشتراز ۴ تا باشد" }])
        return redirect(req, res, 400)
      }
    }
    if (Object.keys(req.files).length < 2) {
      req.flash('errors', [{ msg: "لطفا حداقل یک فایل برای تایتل و کالا اپلود کنید" }])
      return redirect(req, res, 401)
    }
    for (const img of req.files.title) {
      if (!validateExt.includes(path.extname(img.originalname))) {
        req.flash("errors", [{
          msg: ` ${img.originalname} .png .jpeg .jpg .img فرمت های معتبر`
        }])
        return redirect(req, res, 402)
      }
    }
    for (const img of req.files.product) {
      if (!validateExt.includes(path.extname(img.originalname))) {
        req.flash("errors", [{
          msg: ` ${img.originalname} .png .jpeg .jpg .img فرمت های معتبر`
        }])
        return redirect(req, res, 400)
      }
    }
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        req.flash('errors', result.array())
        return redirect(req, res, 400)
      }
    }
    next()
  })
}

module.exports = uploaderErrorHandler
