const tables = require("../models/tables");

exports.getHome = async (req, res, next) => {
  try {
    const products = await tables.Product.findAll({
      include: [
        { model: tables.Image, as: "productImage", where: { type: "title" } },
      ],
    });

    const contex = {
      title: "فروشگاه رویسر",
      products,
    };
    res.render("index", contex);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
