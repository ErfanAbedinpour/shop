const { Router } = require('express');
const validator = require('../validator/authValidator');
const middlewares = require('../middlewares/mid')
const auth = require('../controller/auth.c')
const validatorHandler = require('../utils/errorHandler')


const router = Router()


router.route('/register')
  .get(middlewares.isNotAuth, auth.getRegister)
  .post(middlewares.isNotAuth, validator.singUpValidator, validatorHandler('/auth/register'), auth.postRegister)

router.route('/login')
  .get(middlewares.isNotAuth, auth.getLogin)
  .post(middlewares.isNotAuth, validator.loginValidator, validatorHandler('/auth/login'), auth.loginPost)

router.route('/logout')
  .get(middlewares.isAuth, auth.logOutGet)

router.route('/ban/:userId', middlewares.isAuth, middlewares.auth, middlewares.isAdmin, auth.banPost);
module.exports = router
