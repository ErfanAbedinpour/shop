require('dotenv').config();
const express = require('express');
const { db } = require('./utils/constant');
const session = require("express-session");
const RedisStore = require("connect-redis").default
const { redis } = require('./utils/constant');
const flash = require('connect-flash');
const logger = require('morgan')
const path = require('path');
require('dotenv').config({ path: "./.env" });
const app = express()

const store = new RedisStore({
    client: redis,
    prefix: "session:"
})

app.use(
    session({
        store: store,
        secret: process.env.SECRET,
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
app.use(logger('dev'))


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
