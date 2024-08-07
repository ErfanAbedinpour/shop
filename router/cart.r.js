const { Router } = require("express");
const cartController = require("../controller/cart.c.js");
const middlewares = require("../middlewares/mid.js");
const router = Router();

router.route("/add").post(cartController.addProductToCart);

router.route("/").get(cartController.cartGet);
module.exports = router;
