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
    name: "title",
    maxCount: 1,
  },
  {
    name: "product",
    maxCount: 4
  }
]);


router.route('/add')
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, uploaderError(validator.createProductValidator, uploader), productController.createProduct)
  .get(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, productController.getCreate)

router
  .route('/delete/:productId')
  .post(productController.deleteProduct)

router.route('/:productId')
  .get(productController.getProductById)
module.exports = router
