const tables = require("../models/tables");
const createError = require("http-errors");

exports.calcUserCartCount = (req, res, next) => {
    let count = 0;
    if (!req.session.isAuth) {
        if (!req.session.cart || req.session.cart.length < 1) {
            req.session.cart = [];
            res.locals.cartItemNumber = count;
            return next();
        }
        for (const { quantity } of req.session.cart) {
            count += quantity;
        }
        res.locals.cartItemNumber = Number(count);
        return next();
    } else if (req.session.isAuth) {
        try {
            tables.Cart.findOne({
                where: { UserId: req.session.userId },
            }).then((userCart) => {
                if (userCart) {
                    tables.ProductCart.findAll({
                        where: { CartId: userCart?.id },
                    }).then((userProducts) => {
                        if (userProducts) {
                            for (const { quantity } of userProducts) {
                                count += quantity;
                            }
                        }
                    });
                }
                res.locals.cartItemNumber = count;
                return next();
            });
        } catch (error) {
            next(createError(500, error.message));
        }
    }
};

exports.getCategories = (req, res, next) => {
    try {
        tables.Category.findAll({
            attributes: ["name", "slug"],
        }).then((category) => {
            res.locals.category = category;
            next();
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};
