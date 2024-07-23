const session = require("express-session");
const sequlizeStore = require("connect-session-sequelize")(session.Store)
const flash = require('connect-flash');
const logger = require('morgan')
const { db } = require('../utils/constant')
const { Router } = require('express')
const router = Router()


const store = new sequlizeStore({
  db: db,
})

router.use(
  session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);


router.use(flash());
router.use(logger('dev'))


module.exports = router
