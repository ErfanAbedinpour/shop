const { Router } = require("express");
const homeController = require("../controller/home.c");

const router = Router();

router.route("/").get(homeController.getHome);
module.exports = router;
