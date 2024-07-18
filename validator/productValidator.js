const { body } = require('express-validator')

exports.createProductValidator = [
  body('title')
    .notEmpty()
    .withMessage('تایتل فیلد اجباری است')
    .bail()
    .isLength({ min: 6 })
    .withMessage('حداقل باید ۶ کارکتر باشد تایتل')
    .bail()
  ,
  body('decription')
    .notEmpty('')
    .withMessage('لطفا توضیحات محصول را بنویسید')
    .bail()
    .isLength({ min: 8 })
    .withMessage('توضیحات حداقل باید ۸ کارکتر باشد')
  ,
  body('stockQuantity')
    .notEmpty()
    .withMessage('لطفا موجودی کالا را وارد کنید')
    .bail()
  ,
  body('price')
    .notEmpty()
    .withMessage('لطفا قیمت را وارد کنید')
    .bail()
    .customSanitizer(p => parseFloat(p))
    .isFloat()
    .withMessage('لطفا مبلغ معتبر وارد کنید')
    .bail()
  ,
]
