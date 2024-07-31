require("dotenv").config();
const express = require("express");
const path = require("path");
const middlewares = require("./config/midConfig");
const tables = require("./models/tables");
require("dotenv").config({ path: "./.env" });

function createApp(db) {
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(middlewares(db));

  app.use((req, _, next) => {
    tables.Category.findAll({ attributes: ["name", "slug"] }).then(
      (category) => {
        const isAuth = req.session.user || false;
        const localPaylaod = {
          isAuth,
          path: req.path,
          currentUser: req.session.user,
          category: category,
        };
        app.locals = localPaylaod;
        next();
      },
    );
  });

  //home route
  const homeRouter = require("./router/home.r");
  app.use(homeRouter);
  //auth route
  const authRouter = require("./router/auth.r");
  app.use("/auth", authRouter);
  //product route
  const porductRouter = require("./router/product.r");
  app.use("/product", porductRouter);

  app.use((req, res, next) => {
    const error = new Error(
      "متأسفیم، ما نتوانستیم صفحه ای را که در آن جستجو می کردید پیدا کنیم. پیشنهاد می کنیم به صفحه اصلی بازگردید.",
    );
    error.status = 404;
    next(error);
  });

  app.use((err, req, res, next) => {
    res.status(err.status ?? 404).render("error", {
      msg: err.message,
      preLoad: "صفحه ارور",
    });
  });

  return app;
}

module.exports = createApp;
