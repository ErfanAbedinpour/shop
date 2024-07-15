const { Router } = require('express');
const validator = require('../validator/authValidator');
const middlewares = require('../middlewares/mid')
const auth = require('../controller/auth.c')


const router = Router()


router.route('/register')
  .get(auth.getRegister)
  .post(validator.singUpValidator, auth.postRegister)

module.exports = router
