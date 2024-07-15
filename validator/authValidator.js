const { body } = require('express-validator')
const userModel = require('../models/User')

exports.singUpValidator = [
  body('username')
    .notEmpty()
    .withMessage('نام کاربری اجباری است')
    .bail()
    .isLength({ min: "4" })
    .withMessage('نام کاربری باید حداقل ۴ کاراکتر داشته باشد')
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
    })
    .bail(),
  body('email')
    .notEmpty()
    .withMessage('ایمیل اجباری است')
    .bail()
    .isEmail()
    .withMessage('لطفا ایمیل معتبر وارد کنید')
    .bail()
    .custom(async (email) => {
      const user = await userModel.findOne({ where: { email } })
      if (user) throw new Error("این ایمیل توسط شخص دیگر استفاده میشود")
      return true
    })
    .bail(),
  body('password')
    .notEmpty()
    .withMessage('پسورد اجباری است')
    .bail()
    .isLength({ min: "6" })
    .withMessage('پسورد باید حداقل ۶ کاراکتر داشته باشد')
    .bail()
    .custom((pass, { req }) => {
      if (req.body.confirmPassword !== pass) {
        throw new Error('پسورد ها همخونی ندارند')
      }
      return true
    })
  ,
]
