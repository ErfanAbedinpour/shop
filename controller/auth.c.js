const { User } = require('../models/tables');
const { validationResult } = require('express-validator')
const { errorMessage, messageRawList } = require('../helper/messageCls')
//register user
exports.getRegister = (req, res, next) => {
  const contex = {
    msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
    title: "ثبت نام"
  }
  res.status(200)
  res.render('register', contex)
}

exports.postRegister = async function(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array());
      res.status(400)
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
      res.status(201)
      return res.redirect('back');
    }
    req.flash('success', [
      {
        color: 'green',
        msg: "user created succesfully"
      }
    ])
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
    res.status(200)
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
      res.status(400);
      return res.redirect(req.originalUrl);
    }
    res.status(200);
    req.session.userId = req.user.id;
    req.session.user = { username: req.user.username, role: req.session.role, email: req.user.email };
    req.session.isAuth = true;
    res.redirect('/');
    return
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

exports.logOutPost = function(req, res, next) {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.redirect(req.originalUrl);
      }
      res.status(302);
      res.redirect('/auth/login');
    })
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
