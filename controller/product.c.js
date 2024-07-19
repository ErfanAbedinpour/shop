const { validationResult } = require('express-validator')
const { messageRawList, errorMessage } = require('../helper/messageCls')
const tables = require('../models/tables');


exports.getCreate = (req, res, next) => {
  const msgObj = messageRawList(req.flash('success')) ?? errorMessage(req.flash('errors'));
  tables.Category.findAll().then(category => {
    console.log(category)
    const contex = {
      preLoad: "لطفا کالا خود را اضافه کنید",
      title: "افزودن کالا",
      msgObj,
      category
    }
    res.render('product-add', contex);

  });

}

exports.createPost = (req, res, next) => {
  try {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      req.flash('errors', result.array()
      )
      return res.redirect(req.originalUrl)
    }
    const titleImage = req.files.titleImage[0].filename;
    const pImages = req.files.images.map(img => img.filename);
    res.json({
      title: titleImage,
      pImages
    })
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
