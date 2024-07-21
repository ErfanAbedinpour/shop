const { Router } = require('express')
const productController = require('../controller/product.c')
const validator = require('../validator/productValidator')
const middlewares = require('../middlewares/mid');
const createUploaderOption = require('../utils/uploader');
const multer = require('multer')

const router = Router();
// createUploaderOption('product')
let uploader = multer({ storage: multer.memoryStorage() }, {
}).fields([
  {
    name: "titleImage",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 4
  }
]);

const uploaderErrorHandler = (validations) => (req, res, next) => {
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

router.route('/add')
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, uploaderErrorHandler(validator.createProductValidator), productController.createPost)
  .get(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, productController.getCreate)

router
  .route('/delete/:productId')
  .post(productController.deletePost)

module.exports = router
