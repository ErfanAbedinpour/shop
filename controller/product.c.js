const { messageRawList, errorMessage } = require('../helper/messageCls')
const fs = require('fs').promises
const path = require('path');
const tables = require('../models/tables');
const compressImg = require('../helper/compressImg');


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
    const imagesFilename = [];
    const { filename: titleImage } = await compressImg(req.files.titleImage[0], 'productTitle');
    req.files.images.forEach(async img => {
      const { filename } = await compressImg(img, 'productImages');
      if (!filename) {
        req.flash('errors', [{
          msg: `faild to upload ${img.originalName}`
        }])
        return res.redirect(req.originalUrl)
      }
      imagesFilename.push({ filename });
    })
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
    await product.addImages(await tables.Image.bulkCreate(imagesFilename));
    req.flash('success', [{
      msg: "کالا با موقیت اضافه شد",
      color: 'green'
    }])
    res.redirect(req.originalUrl);
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const { productId } = req.params
    if (!productId) {
      req.flash('errors', [{ msg: "درخواست معتبر نیست", color: 'red' }])
      return res.status(401).redirect(req.originalUrl)
    }
    const product = await tables.Product.findOne({ where: { id: +productId } })
    if (!product) {
      req.flash('errors', [{ msg: "کالا پیدا نشد", color: 'red' }])
      return res.json({ msg: "product not found" })
    }
    const titleImage = path.join(__dirname, '..', 'public', 'productsImage', product.titleImage);
    fs.stat(titleImage)
      .then(async () => {
        await fs.unlink(titleImage);
        Promise.resolve();
      })
      .catch(async err => {
        Promise.resolve()
      })
    await product.destroyImages()
    await product.destroy()
    await product.save()
    res.json({ product })
  } catch (error) {
    error.status = 500;
    next(error)
  }
}

