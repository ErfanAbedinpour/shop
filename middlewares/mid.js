const isNotAuth = (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect('/');
    }
    next()
  } catch (error) {
    error.status = 500;
    next(error)
  }
}

const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next()
}

module.exports = {
  isNotAuth,
  isAuth
}
