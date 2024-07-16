const { Router } = require('express');
const validator = require('../validator/authValidator');
const middlewares = require('../middlewares/mid')
const auth = require('../controller/auth.c')


const router = Router()


router.route('/register')
  .get(middlewares.isNotAuth, auth.getRegister)
  .post(middlewares.isNotAuth, validator.singUpValidator, auth.postRegister)

router.route('/login')
  .get(middlewares.isNotAuth, auth.getLogin)
  .post(middlewares.isNotAuth, validator.loginValidator, auth.loginPost)
module.exports = router
