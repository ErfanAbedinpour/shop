const { Router } = require('express')
const productController = require('../controller/product.c')
const validator = require('../validator/productValidator')
const middlewares = require('../middlewares/mid');
const createUploaderOption = require('../utils/uploader');
const multer = require('multer')

const router = Router();

let uploader = multer(createUploaderOption('product')).fields([
  {
    name: "titleImage",
    maxCount: 1
  },
  {
    name: "images",
    maxCount: 4
  }
]);

router.route('/add')
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, (req, res, next) => {
    uploader(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          err.message = 'تعداد فایل حداکثر میتواند 4 تا باشد'
          err.status = 401
          next(err);
        }
      }
      next()
    })
  }, validator.createProductValidator, productController.createPost)
  .get(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, productController.getCreate)


module.exports = router
