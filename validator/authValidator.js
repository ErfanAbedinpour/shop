const { body } = require('express-validator')
const userModel = require('../models/User')

exports.singUpValidator = [
  body('username')
    .notEmpty()
    .withMessage('usrname is required')
    .bail()
    .isLength({ min: "4" })
    .withMessage('username must be letter than 4 charackter')
    .bail(),
  body('role')
    .optional()
    .notEmpty()
    .withMessage('role is empty')
    .bail()
    .custom(role => {
      if (!['user', 'admin'].includes(role)) {
        throw new Error('role not valid');
      }
      return true
    }),
  body('email')
    .notEmpty()
    .withMessage('email required')
    .bail()
    .isEmail()
    .withMessage('please enter valid email')
    .bail()
    .custom(email => {
      return userModel.findOne({ where: { email } }).then(user => {
        if (user) throw new Error("some one with this username is registered")
        return true
      })
    })
    .bail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: "6" })
    .withMessage('password must be letter that 6 char')
    .bail()
  ,
]
