const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const { db: sequlize } = require('../utils/constant')
const path = require('path');
const router = express.Router()

//session config
router.use(session({
    secret: process.env.SECRET,
    store: new SequelizeStore({
        db: sequlize,
        tableName: "sessions",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));

router.use(express.json())
router.use(express.urlencoded({ extended: false }));
//flash config

//middleware
router.use(express.static(path.join(__dirname, '../public')));
//falsh for share message between templated
router.use(flash());

module.exports = router
