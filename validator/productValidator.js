const { body, validationResult } = require('express-validator')
const tables = require('../models/tables')


exports.createProductValidator = [
  body('title')
    .notEmpty()
    .withMessage('تایتل فیلد اجباری است')
    .bail()
    .isLength({ min: 4 })
    .withMessage('حداقل باید ۶ کارکتر باشد تایتل')
    .bail()
  ,
  body('description')
    .notEmpty()
    .withMessage('لطفا توضیحات محصول را بنویسید')
    .bail()
    .customSanitizer(des => des.trim())
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
  body('category')
    .custom(value => {
      if (!value) {
        throw new Error('لطفا دسته بندی را وارد کنید')
      }
      return true
    })
    .bail()
    .customSanitizer(id => +id)
    .custom(async (cate, { req }) => {
      const category = await tables.Category.findOne({ where: { id: cate } })
      if (!category) {
        throw new Error('لطفا دسته بندی معتبر وارد کنید')
      }
      req.category = category.id;
      return true
    })
  ,
]
