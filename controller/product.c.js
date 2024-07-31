const { messageRawList, errorMessage } = require("../helper/messageCls");
const fs = require("fs").promises;
const path = require("path");
const tables = require("../models/tables");
const compressImg = require("../helper/compressImg");
const { redirect } = require("../helper/redirect");

//create product page render
exports.getCreate = async (req, res, next) => {
  const msgObj =
    messageRawList(req.flash("success")) ?? errorMessage(req.flash("errors"));
  try {
    const category = await tables.Category.findAll();
    const contex = {
      preLoad: "لطفا کالا خود را اضافه کنید",
      title: "افزودن کالا",
      msgObj,
      category,
      csrf_token: req.session.csrf.token,
    };
    res.render("product/product-add", contex);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { title, shortDescribe, longDescribe, price, stockQuantity } =
      req.body;
    const product = await tables.Product.create({
      title,
      shortDescribe: shortDescribe,
      longDescribe: longDescribe,
      price,
      stockQuantity: +stockQuantity,
      CategoryId: req.category,
    });
    await req.user.addProduct(product);
    const imgArray = req.files.product.concat(req.files.title);
    const imgPromises = await imgArray.map((img) => {
      return compressImg(img, "productImages");
    });
    const imagesFilename = (await Promise.all(imgPromises)).map((arr) => {
      return { type: arr.type, filename: arr.filename };
    });
    await product.addProductImage(
      await tables.Image.bulkCreate(imagesFilename),
    );
    req.flash("success", [
      {
        msg: "کالا با موقیت اضافه شد",
        color: "green",
      },
    ]);
    return redirect(req, res);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
//delete product login
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      req.flash("errors", [{ msg: "درخواست معتبر نیست", color: "red" }]);
      return redirect(req, res, 401);
    }
    const product = await tables.Product.findOne({
      where: { id: +productId },
      include: "productImage",
    });
    if (!product) {
      req.flash("errors", [{ msg: "کالا پیدا نشد", color: "red" }]);
      return redirect(req, res, 400);
    }
    const filenamesToRemove = product.productImage.map(async (img) => {
      const imgPath = path.join(
        __dirname,
        "../public",
        "productImages",
        img.filename,
      );
      return fs
        .unlink(imgPath)
        .then(() => Promise.resolve())
        .catch(() => Promise.resolve());
    });
    await Promise.all(filenamesToRemove);
    await product.destroy();
    await product.save();
    req.flash("success", [
      {
        msg: "product removed succesfully",
        color: "green",
      },
    ]);
    res.json({
      status: true,
      msg: "product delete succesfully",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

//get Product by ID
exports.getProductById = async function (req, res, next) {
  const { productId } = req.params;
  if (!productId) {
    req.flash("errors", [{ msg: "productId does not exsist" }]);
    res.status(401);
    return res.redirect("back");
  }
  try {
    const product = await tables.Product.findOne({
      where: { id: +productId },
      include: ["productImage", "Category"],
    });
    if (!product) {
      req.flash("errors", [{ msg: "porduct does not found" }]);
      return res.redirect("back");
    }
    const contex = {
      title: `کالای ${product.title}`,
      product,
      preLoad: "جزیبات محصول",
    };
    console.log(product.productImage);
    res.render("product/product-details", contex);
  } catch (err) {
    err.status = 500;
    next(err);
  }
};
