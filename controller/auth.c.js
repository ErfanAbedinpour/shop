const { User } = require('../models/tables');
const { errorMessage, messageRawList } = require('../helper/messageCls');
const user = require('../models/User');

function redirect(req, res, status = 200, to = null) {
  to = to || req.originalUrl
  return req.session.save(() => {
    res.status(status).redirect(to)
  })
}
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
      return redirect(req, res, 401, 'back');
    }
    req.flash('success', [
      {
        color: 'green',
        msg: "اکانت با موفقیت ساخته شد"
      }
    ])
    return redirect(req, res, 201);
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
    req.session.userId = req.user.id;
    return redirect(req, res, 200, '/')
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

//ban user
exports.banPost = function(req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    req.flash('errors', [{
      msg: "userId not found",
      color: 'red'
    }])
    return redirect(req, res)
  }

  user.findOne({ where: { id: +userId } }).then(user => {
    if (user) {
      return user
    }
    req.flash('errors', [{ msg: "user not found" }])
    return redirect(req, res, 400)
  }).then(user => {
    user.isBan = true
    return user.save()
  }).then(() => {
    req.flash('success', [{
      msg: "user ban successfully",
      color: 'green'
    }])
    redirect(req, res, 200)
  })
}
