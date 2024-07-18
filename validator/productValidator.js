const { body } = require('express-validator')


const createProductValidator = [
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


]
