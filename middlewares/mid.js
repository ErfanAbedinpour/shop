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
            return Promise.reject();
          }
          req.user = user;
          return next();
        })
    }
    req.flash([
      {
        color: 'red',
        msg: "لطفا لاگین کنید"
      }
    ])
    return res.redirect('/auth/login')
  } catch (error) {
    error.status = 500;
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next()
  const err = new Error("this router only avalibale for admin")
  next(err);
}
module.exports = {
  isNotAuth,
  isAuth,
  auth,
  isAdmin
}
