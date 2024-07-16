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
    console.log(req.session.isAuth)
    app.locals = {
        path: req.path,
    }
    next()
})

const authRouter = require('./router/auth.r');
app.use('/auth', authRouter);


app.use((err, req, res, next) => {
    if (err) return next(err);
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
