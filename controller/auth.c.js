const userModel = require('../models/User');
const { validationResult } = require('express-validator')
const { errorMessage, messageRawList } = require('../helper/messageCls')
//register user
exports.getRegister = (req, res, next) => {
  const contex = {
    msgObj: errorMessage(req.flash('errors')) ?? messageRawList(req.flash('success')),
    title: "singup page"
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
    const role = await userModel.count() > 1 ? "admin" : "user";
    const isFinish = await userModel.create({
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
    req.flash('success', [{
      msg: "user create succesfully",
      color: 'green'
    }])
    return res.redirect('/auth/login')
  } catch (error) {
    console.error(error)
    error.status = 500;
    next(error)
  }
}

//login user
