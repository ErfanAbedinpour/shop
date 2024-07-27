const session = require("express-session");
const sequlizeStore = require("connect-session-sequelize")(session.Store)
const flash = require('connect-flash');
const logger = require('morgan')
const { Router } = require('express')



function dbStore(db) {
  const store = new sequlizeStore({
    db: db,
  })
  return store;
}


function createMiddlewares(db) {
  const router = Router();
  router.use(
    session({
      store: dbStore(db),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: (7 * 24 * 60 * 60 * 1000) + Date.now(), httpOnly: true }
    })
  );

  router.use(flash());
  router.use(logger('dev'))
  return router
}




module.exports = createMiddlewares

