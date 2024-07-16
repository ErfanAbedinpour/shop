const { User, Session } = require('../models/tables');
const { validationResult } = require('express-validator')
const { errorMessage, messageRawList } = require('../helper/messageCls')
//register user
exports.getRegister = (req, res, next) => {
  const contex = {
    msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
    title: "ثبت نام"
  }
  res.render('register', contex)
}

exports.postRegister = async function(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array());
      res.redirect('/auth/register');
      return
    }
    const { username, password, email } = req.body;
    const role = await User.count() > 1 ? "admin" : "user";
    const isFinish = await User.create({
      username,
      password,
      email,
      role
    });
    if (!isFinish) {
      req.flash('errors', [{
        color: 'red',
        msg: "error create user"
      }])
      return res.redirect('back')
    }
    return res.redirect('/auth/login')
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

//login user
exports.getLogin = (req, res, next) => {
  try {
    const contex = {
      msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
      title: "صفحه ورود"
    }
    res.render('login', contex)
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

exports.loginPost = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array());
      return res.redirect(req.originalUrl);
    }
    await Session.update(
      { userId: req.user },
      {
        where: {
          sid: req.session.id
        }
      }
    )
    req.session.isAuth = true
    res.redirect('/')
    return
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}
