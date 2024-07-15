require('dotenv').config();
const express = require('express');
const { db } = require('./utils/constant');
const middlewares = require('./middlewares/mid');
const path = require('path');
require('dotenv').config({ path: "./.env" });

(async function() {
    try {
        await db.authenticate();
        console.log('DB is connected');
        await db.sync({ logging: false })
        console.log('sync succefully');
    } catch (err) {
        throw new Error(err.message)
    }
})();

const app = express()

app.set('view engine', 'ejs')
app.use(middlewares)
app.set('views', path.join(__dirname, 'views'))


app.use((req, res, next) => {
    const isAuth = req.session.user ? true : false;
    app.locals = {
        path: req.path,
        current_user: req.session.user,
        isAuth: isAuth,
    }
    next()
})



app.use((req, res, next) => {
    const error = new Error("متأسفیم، ما نتوانستیم صفحه ای را که در آن جستجو می کردید پیدا کنیم. پیشنهاد می کنیم به صفحه اصلی بازگردید.");
    error.status = 403;
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status)
        .render('error', {
            msg: err.message,
            statusCode: err.status
        })
})



app.listen(8000, () => { console.log('server run on 8000 port') })
