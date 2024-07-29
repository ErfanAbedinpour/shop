const { Router } = require('express');
const validator = require('../validator/authValidator');
const middlewares = require('../middlewares/mid')
const auth = require('../controller/auth.c')
const validatorHandler = require('../utils/errorHandler')
const csrfToken = require('../utils/csrfToken')


const router = Router()


router.route('/register')
  .get(middlewares.isNotAuth, csrfToken.genCsrfToken, auth.getRegister)
  .post(middlewares.isNotAuth, csrfToken.verifyCsrfToken, validator.singUpValidator, validatorHandler('/auth/register'), auth.postRegister)

router.route('/login')
  .get(middlewares.isNotAuth, csrfToken.genCsrfToken, auth.getLogin)
  .post(middlewares.isNotAuth, csrfToken.verifyCsrfToken, validator.loginValidator, validatorHandler('/auth/login'), auth.loginPost)

router.route('/logout')
  .get(middlewares.isAuth, auth.logOutGet)

router.route('/ban/:userId', middlewares.isAuth, middlewares.auth, middlewares.isAdmin, auth.banPost);


router.route('/reset')
  .get(csrfToken.genCsrfToken, auth.getReset)
  .post(csrfToken.verifyCsrfToken, auth.postReset)

router.route('/forgetPassword')
  .get(csrfToken.genCsrfToken, auth.forgetPasswordGet)
  .post(csrfToken.verifyCsrfToken, validator.forGetPasswordValidator, auth.forgetPasswordPost)
module.exports = router
