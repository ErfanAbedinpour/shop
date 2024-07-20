const { validationResult } = require('express-validator')
const { messageRawList, errorMessage } = require('../helper/messageCls')
const tables = require('../models/tables');


exports.getCreate = (req, res, next) => {
  const msgObj = messageRawList(req.flash('success')) ?? errorMessage(req.flash('errors'));
  tables.Category.findAll().then(category => {
    const contex = {
      preLoad: "لطفا کالا خود را اضافه کنید",
      title: "افزودن کالا",
      msgObj,
      category
    }
    res.render('product-add', contex);

  });

}

exports.createPost = async (req, res, next) => {
  try {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      console.log(res
      )
      req.flash('errors', result.array()
      )
      return res.redirect(req.originalUrl)
    }
    const titleImage = req.files.titleImage[0].filename;
    const pImages = req.files.images.map(img => { return { filename: img.filename } });
    const { title, description, price, stockQuantity } = req.body;
    const product = await tables.Product.create({
      titleImage,
      title,
      describe: description,
      price,
      stockQuantity: +stockQuantity,
      CategoryId: req.category
    })
    await req.user.addProduct(product);
    await product.addImages(await tables.Image.bulkCreate(pImages));
    req.flash('success', [{
      msg: "کالا با موقیت اضافه شد",
      color: 'green'
    }])
    res.redirect(req.originalUrl);
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
