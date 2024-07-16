require('dotenv').config();
const express = require('express');
const { db } = require('./utils/constant');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config({ path: "./.env" });
const app = express()


app.use(
    session({
        secret: process.env.SECRET,
        store: new SequelizeStore({
            db: db,
            expiration: Math.round(Date.now() + (7 * 24 * 60 * 60 * 1000))
        }),
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    app.locals = {
        path: req.path,
        currentUser: req.session.user,
        isAuth: req.session.isAuth
    }
    next()
})

const homeRouter = require('./router/home.r')
app.use(homeRouter);
const authRouter = require('./router/auth.r');
app.use('/auth', authRouter);


app.use((req, res, next) => {
    const error = new Error("متأسفیم، ما نتوانستیم صفحه ای را که در آن جستجو می کردید پیدا کنیم. پیشنهاد می کنیم به صفحه اصلی بازگردید.");
    error.status = 403;
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status ?? 500)
        .render('error', {
            msg: err.message,
        })
})


module.exports = app
