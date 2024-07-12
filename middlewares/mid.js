const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const router = express.Router()

//session config
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

router.use(express.json())
router.use(express.urlencoded({extended:false}));
//flash config

//middleware
router.use(express.static(path.join(__dirname,'../public')));

router.use(flash());

module.exports = router