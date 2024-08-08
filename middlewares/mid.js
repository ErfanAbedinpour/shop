const tables = require("../models/tables");
const craeteError = require("http-errors");

const isNotAuth = (req, res, next) => {
    if (req.session?.isAuth) {
        return res.redirect("/");
    }
    next();
};

const isAuth = (req, res, next) => {
    if (req.session?.isAuth) {
        return next();
    }
    return res.redirect("/auth/login");
};

const auth = (req, res, next) => {
    try {
        const userId = req.session?.userId;
        if (userId) {
            tables.User.findOne({ where: { id: +userId } }).then((user) => {
                if (!user) {
                    req.session.destroy();
                    req.flash([
                        {
                            color: "red",
                            msg: "لطفا لاگین کنید",
                        },
                    ]);
                    return res.redirect("/auth/login");
                }
                req.user = user;
                next();
            });
        }
    } catch (error) {
        error.status = 500;
        next(error);
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") return next();
    next(craeteError(404, "صفحه پیدا نشد"));
};
module.exports = {
    isNotAuth,
    isAuth,
    auth,
    isAdmin,
};
