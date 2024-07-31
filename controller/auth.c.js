const { User } = require("../models/tables");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Email = require("../utils/email");
const { errorMessage, messageRawList } = require("../helper/messageCls");
const { redirect } = require("../helper/redirect");
const tables = require("../models/tables");
const { validationResult } = require("express-validator");

//register page render
exports.getRegister = (req, res) => {
  const contex = {
    msgObj:
      errorMessage(req.flash("errors")) ?? messageRawList(req.flash("success")),
    title: "ثبت نام",
    preLoad: "ساخت حساب جدید",
    csrf_token: req.session.csrf.token,
  };
  res.status(200).render("auth/register", contex);
};
//post registerl
exports.postRegister = async function (req, res, next) {
  try {
    const { username, password, email } = req.body;
    const role = (await User.count()) < 1 ? "admin" : "user";
    const isFinish = await User.create({
      username,
      password,
      email,
      role,
    });
    if (!isFinish) {
      req.flash("errors", [
        {
          color: "red",
          msg: "error create user",
        },
      ]);
      return redirect(req, res, 401);
    }
    req.flash("success", [
      {
        color: "green",
        msg: "اکانت با موفقیت ساخته شد",
      },
    ]);
    return redirect(req, res, 201, "/auth/login");
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

//login page render

exports.getLogin = (req, res, next) => {
  try {
    const contex = {
      msgObj:
        errorMessage(req.flash("errors")) ??
        messageRawList(req.flash("success")),
      title: "صفحه ورود",
      preLoad: "وارد حساب خود شوید",
      csrf_token: req.session.csrf.token,
    };
    return res.status(200).render("auth/login", contex);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
//login postl
exports.loginPost = async (req, res, next) => {
  try {
    req.session.userId = req.user.id;
    req.session.user = req.user;
    return redirect(req, res, 200, "/");
  } catch (error) {
    console.error(error);
    error.status = 500;
    next(error);
  }
};
//logout user
exports.logOutGet = function (req, res, next) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect(req.originalUrl);
      }
      res.status(302).redirect("/");
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

//ban user
exports.banPost = async function (req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    req.flash("errors", [
      {
        msg: "userId not found",
        color: "red",
      },
    ]);
    return redirect(req, res);
  }
  const user = await User.findOne({ where: { id: +userId } });
  if (!user) {
    req.flash("errors", [{ msg: "user not found" }]);
    return redirect(req, res, 400);
  }
  user.isBan = true;
  user.save();
  req.flash("success", [
    {
      msg: "user ban successfully",
      color: "green",
    },
  ]);
  return redirect(req, res, 200);
};

//reset password GET
exports.getReset = function (req, res, next) {
  const msgObj =
    errorMessage(req.flash("errors")) ?? messageRawList(req.flash("success"));
  const contex = {
    msgObj,
    title: "password reset",
    preLoad: "بارنشانی رمز عبور",
    csrf_token: req.session.csrf.token,
  };

  res.render("auth/resetPassword", contex);
};

//reset password POST
exports.postReset = async function (req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.flash("errors", [{ msg: "کاربر پیدا نشد" }]);
    return redirect(req, res);
  }
  const tokenExsist = await user.getResetPassword();
  if (tokenExsist) {
    await tokenExsist.destroy();
  }
  const token = (await crypto.randomBytes(30)).toString("hex");
  const expire = Date.now() + 10 * 60 * 60 * 1000;
  const html = `
  <h1> reset password link </h1>
  <h3/> for reset password click to this <a href="http://localhost:8000/auth/forgetPassword?token=${token}">link</a></h3> 
  `;
  try {
    await user.createResetPassword({
      token,
      expireTime: expire,
    });
    await new Email().sendMail(email, "reset password", html);
    req.flash("success", [{ msg: "با موفقیت ارسال شد", color: "green" }]);
    return redirect(req, res);
  } catch (err) {
    console.error(err);
    req.flash("errors", [{ msg: "خطا در ارسال لطفا مجدد دوباره امتحان کنید" }]);
    redirect(req, res);
  }
};

//forget Passwod GET
exports.forgetPasswordGet = async function (req, res, next) {
  if (!req.query?.token) {
    return redirect(req, res, 404, "/auth/login");
  }
  const token = req.query.token;
  const resetPassToken = await tables.resetPassword.findOne({
    where: { token },
  });
  if (!resetPassToken || !resetPassToken.expireTime.getTime() >= Date.now()) {
    req.flash("errors", [{ msg: "درخواست معتبر نیست" }]);
    return redirect(req, res, 400, "/auth/reset");
  }
  const msgObj =
    errorMessage(req.flash("errors")) ?? messageRawList(req.flash("success"));
  const contex = {
    msgObj,
    token: token,
    title: "انتخاب پسورد جدید",
    preLoad: "تغییر پسورد",
    csrf_token: req.session.csrf.token,
  };
  res.render("auth/forgetPassword", contex);
};

//for get password LOGIN POST
exports.forgetPasswordPost = async function (req, res) {
  if (!req.body.token) {
    req.flash("errors", [{ msg: "درخواست معتبر نیست" }]);
    return redirect(req, res, 301, "/auth/reset");
  }
  const token = req.body.token;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    req.flash("errors", result.array());
    return redirect(req, res, 301, `/auth/forgetPassword?token=${token}`);
  }
  const tokenInfo = await tables.resetPassword.findOne({ where: { token } });
  if (!tokenInfo) {
    req.flash("errors", [{ msg: "در خواست معتبر نیست" }]);
    return redirect(req, res, 421, `/auth/reset`);
  }
  const { password } = req.body;
  const user = await tables.User.findOne({ where: { id: tokenInfo.UserId } });
  if (!user) {
    req.flash("errors", [
      { msg: "مشکلی پیش اومده لطفا بعدا دوباره تلاش کنید" },
    ]);
    return redirect(req, res, 400, "/auth/reset");
  }
  const hashPass = await bcrypt.hash(password, 12);
  user.password = hashPass;
  await user.save();
  req.session.destroy(async () => {
    await tokenInfo.destroy();
    return res.redirect("/auth/login");
  });
};
