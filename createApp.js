require("dotenv").config();
const express = require("express");
const path = require("path");
const middlewares = require("./config/midConfig");
const tables = require("./models/tables");
const createError = require("http-errors");
const { calcUserCartCount, getCategories } = require("./utils/functions");
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
        if (!req.session || !req.session.isAuth) {
            req.session.isAuth = false;
        }
        let localPaylaod = {
            isAuth: req.session.isAuth,
            path: req.path,
            currentUser: req.session?.user ?? null,
        };
        app.locals = localPaylaod;
        next();
    });
    app.use(getCategories);
    app.use(calcUserCartCount);
    //home route
    const homeRouter = require("./router/home.r");
    app.use(homeRouter);
    //auth route
    const authRouter = require("./router/auth.r");
    app.use("/auth", authRouter);
    //product route
    const porductRouter = require("./router/product.r");
    app.use("/product", porductRouter);
    //cart router
    const cartRouter = require("./router/cart.r.js");
    app.use("/cart", cartRouter);

    app.use((req, res, next) => {
        const errMsg =
            "متأسفیم، ما نتوانستیم صفحه ای را که در آن جستجو می کردید پیدا کنیم. پیشنهاد می کنیم به صفحه اصلی بازگردید.";
        return next(createError(404, errMsg));
    });

    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.status(err.status ?? 500).render("error", {
            preLoad: "صفحه ای یافت نشد",
        });
    });

    return app;
}

module.exports = createApp;
