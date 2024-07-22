const { Router } = require('express')
const productController = require('../controller/product.c')
const validator = require('../validator/productValidator')
const middlewares = require('../middlewares/mid');
const uploaderError = require('../utils/uploaderError')
const multer = require('multer')

const router = Router();
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


router.route('/add')
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, uploaderError(validator.createProductValidator, uploader), productController.createPost)
  .get(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, productController.getCreate)

router
  .route('/delete/:productId')
  .post(productController.deletePost)

module.exports = router
