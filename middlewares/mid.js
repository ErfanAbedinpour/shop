const tables = require('../models/tables');
const isNotAuth = (req, res, next) => {
  try {
    if (req.session?.userId) {
      return res.redirect('/');
    }
    next()
  } catch (error) {
    error.status = 500;
    next(error)
  }
}

const isAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.redirect('/auth/login');
  }
  next()
}

const auth = (req, res, next) => {
  try {
    const userId = req.session?.userId;
    if (userId) {
      tables.User.findOne({ where: { id: +userId } })
        .then(user => {
          if (!user) {
            req.session.destroy();
            return res.redirect('/auth/login');
          }
          req.user = user;
          next();
        })
    }
    next();
  } catch (error) {
    error.status = 500;
  }
}

module.exports = {
  isNotAuth,
  isAuth,
  auth
}
