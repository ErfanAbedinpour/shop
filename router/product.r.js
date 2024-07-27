const { Router } = require('express')
const productController = require('../controller/product.c')
const validator = require('../validator/productValidator')
const middlewares = require('../middlewares/mid');
const uploaderError = require('../utils/uploaderError')
const multer = require('multer')
const csrf = require('../utils/csrfToken')

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
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, uploaderError(validator.createProductValidator, uploader), csrf.verifyCsrfToken, productController.createProduct)
  .get(middlewares.isAuth, middlewares.auth, middlewares.isAdmin, csrf.genCsrfToken, productController.getCreate)

router
  .route('/delete/:productId')
  .post(productController.deleteProduct)

router.route('/:productId')
  .get(productController.getProductById)
module.exports = router
