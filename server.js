require('dotenv').config();
const express = require('express');
const tables = require('./models/tables');
const path = require('path');
const middlewares = require('./config/midConfig')
require('dotenv').config({ path: "./.env" });
const app = express()


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(middlewares);

app.use(async (req, _, next) => {
    let currentUser = null;
    const isAuth = req.session.userId || false
    if (isAuth) {
        currentUser = await tables.User.findOne(({ where: { id: req.session.userId } }));
        if (!currentUser) {
            req.session.destroy((err) => {
                if (err) throw new Error(err)
            })
        }
    }
    const localPaylaod = {
        isAuth,
        path: req.path,
        currentUser: currentUser
    }
    app.locals = localPaylaod;
    next()
})

//home route
const homeRouter = require('./router/home.r')
app.use(homeRouter);
//auth route
const authRouter = require('./router/auth.r');
app.use('/auth', authRouter);
//product route
const porductRouter = require('./router/product.r');
app.use('/product', porductRouter)



app.use((req, res, next) => {
    const error = new Error("متأسفیم، ما نتوانستیم صفحه ای را که در آن جستجو می کردید پیدا کنیم. پیشنهاد می کنیم به صفحه اصلی بازگردید.");
    error.status = 403;
    next(error)
})


app.use((err, req, res, next) => {
    res.status(err.status ?? 500)
        .render('error', {
            msg: err.message,
            preLoad: "صفحه ارور"
        })
})


module.exports = app
