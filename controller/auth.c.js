const { User } = require('../models/tables');
const { validationResult } = require('express-validator')
const { errorMessage, messageRawList } = require('../helper/messageCls')
//register page render
exports.getRegister = (req, res, next) => {
  const contex = {
    msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
    title: "ثبت نام",
    preLoad: "ساخت حساب جدید"
  }
  res.status(200)
    .render('register', contex)
}

//post register
exports.postRegister = async function(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array());
      return res.status(400)
        .redirect('/auth/register');
    }
    const { username, password, email } = req.body;
    const role = await User.count() < 1 ? "admin" : "user";
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
      return res.status(201)
        .redirect('back');
    }
    req.flash('success', [
      {
        color: 'green',
        msg: "اکانت با موفقیت ساخته شد"
      }
    ])
    return res.redirect('/auth/login')
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

//login page render
exports.getLogin = (req, res, next) => {
  try {
    const contex = {
      msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
      title: "صفحه ورود",
      preLoad: "وارد حساب خود شوید"
    }
    return res.status(200)
      .render('login', contex)
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}
//login postl
exports.loginPost = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array());
      return res.status(400)
        .redirect(req.originalUrl);
    }
    req.session.userId = req.user.id;
    return res.status(200)
      .redirect('/');
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}
//logout user
exports.logOutGet = function(req, res, next) {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.redirect(req.originalUrl);
      }
      res.status(302)
        .redirect('/');
    })
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
