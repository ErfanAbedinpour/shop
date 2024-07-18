const { Router } = require('express')
const productController = require('../controller/product.c')
const validator = require('../validator/productValidator')
const middlewares = require('../middlewares/mid')


const router = Router()

router.route('/add')
  .post(middlewares.isAuth, middlewares.auth, middlewares.isAdmin,
    validator.createProductValidator, productController.createPost)


module.exports = router
