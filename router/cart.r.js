const { Router } = require("express");
const cartController = require("../controller/cart.c.js");
const middlewares = require("../middlewares/mid.js");
const router = Router();

router.route("/add").post(middlewares.isAuth, cartController.addProductToCart);

module.exports = router;
