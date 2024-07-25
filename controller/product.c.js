const { messageRawList, errorMessage } = require('../helper/messageCls')
const fs = require('fs').promises
const path = require('path');
const tables = require('../models/tables');
const compressImg = require('../helper/compressImg');


//create product page render
exports.getCreate = async (req, res, next) => {
  const msgObj = messageRawList(req.flash('success')) ?? errorMessage(req.flash('errors'));
  try {
    const category =await  tables.Category.findAll();
    const contex = {
      preLoad: "لطفا کالا خود را اضافه کنید",
      title: "افزودن کالا",
      msgObj,
      category
    }
    res.render('product-add', contex);  
  } catch (error) {
    // error.status = 500;
    next(error);
  }
  

}

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stockQuantity } = req.body;
    const product = await tables.Product.create({
      title,
      describe: description,
      price,
      stockQuantity: +stockQuantity,
      CategoryId: req.category
    })
    await req.user.addProduct(product);
    const imgArray = req.files.product.concat(req.files.title);
    const imgPromises = await (imgArray.map(img => {
      return compressImg(img, 'productImages');
    }))
    const imagesFilename = (await Promise.all(imgPromises)).map(arr => { return { type: arr.type, filename: arr.filename } })
    await product.addProductImage(await tables.Image.bulkCreate(imagesFilename));
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
//delete product login
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    if (!productId) {
      req.flash('errors', [{ msg: "درخواست معتبر نیست", color: 'red' }])
      return res.status(401).redirect(req.originalUrl)
    }
    const product = await tables.Product.findOne({ where: { id: +productId }, include: "productImage" })
    if (!product) {
      req.flash('errors', [{ msg: "کالا پیدا نشد", color: 'red' }])
      return res.json({ msg: "product not found" })
    }
    const filenamesToRemove = product.productImage.map(async img => {
      const imgPath = path.join(__dirname, '../public', 'productImages', img.filename);
      return fs.unlink(imgPath).then(() => Promise.resolve()).catch(() => Promise.resolve());
    });
    await Promise.all(filenamesToRemove)
    await product.destroy()
    await product.save()
    req.flash('success',[{
      msg: "product removed succesfully",
      color:'green'
    }])
  } catch (error) {
    error.status = 500;
    next(error)
  }
}

