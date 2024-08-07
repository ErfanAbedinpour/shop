const tables = require("../models/tables.js");
const { errorMessage, messageRawList } = require("../helper/messageCls");
const createError = require("http-errors");
const { redirect } = require("../helper/redirect");
const { Sequelize } = require("sequelize");

//sequelize opereator
const op = Sequelize.Op;

//this functions for send response for user
function sendError(req, res, msg, backUrl) {
    req.flash("errors", [{ msg }]);
    return redirect(req, res, 400, backUrl);
}

exports.addProductToCart = async function (req, res, next) {
    //get body frmo req
    const { quantity, productId } = req.body;
    try {
        var product = await tables.Product.findOne({
            where: { id: +productId, stockQuantity: { [op.gte]: 1 } },
        });
        //get backUrl for send response
        var backUrl = `/product/${productId}`;
        //valieate product is exsist
        if (!product) {
            req.flash("errors", [{ msg: "تعداد کالا موجود نیست" }]);
            return redirect(req, res, 401, backUrl);
        }
        //check product Quantity and user Quantity
        if (quantity > product.stockQuantity) {
            return sendError(
                req,
                res,
                "تعداد کالا در انبار موجود نیست",
                backUrl,
            );
        }
    } catch (error) {
        return nexr(createError(500, error.message));
    }

    if (req.session.isAuth) {
        try {
            //get user Cart from DB
            const [cart, _] = await tables.Cart.findOrCreate({
                where: { UserId: req.session.user.id },
                through: tables.Product,
            });
            //check to product is in the user cart or not
            const [product_in_user_cart] = await cart.getProducts({
                where: { id: product.id },
            });
            //if product in the user cart calc Quantity if is ok add to cart
            if (product_in_user_cart) {
                const newQuantity =
                    product_in_user_cart.ProductCart.quantity + +quantity;
                //check Quantity
                if (newQuantity > product.stockQuantity) {
                    return sendError(
                        req,
                        res,
                        "تعداد کالا در انبار موجود نیست",
                        backUrl,
                    );
                }
                //if quantity ok add to cart and send response
                await product_in_user_cart.ProductCart.update({
                    quantity: newQuantity,
                });
                req.flash("success", [
                    { msg: "کالا با موفقیت  اپدیت شد", color: "green" },
                ]);
                return redirect(req, res, 201, backUrl);
            }
            //else add product to cart
            await cart.addProduct(product, { through: { quantity: quantity } });
            req.flash("success", [
                { msg: "کالا با موفقیت اضافه شد", color: "green" },
            ]);
            return redirect(req, res, 201, backUrl);
        } catch (error) {
            return next(createError(500, error.message));
        }
    } else {
        // if user not login save user product in sessions

        const cart = req.session.cart;

        //if product in user cart in session take it
        const isProdcutExsistInUserCart = cart.find(
            (p) => p.productId === productId,
        );

        // if product in seesion take it and calc Quantity of product count
        if (!isProdcutExsistInUserCart) {
            cart.push({ productId, quantity: +quantity });
            req.flash("success", [
                {
                    msg: "کالا با موفقیت به سبد خرید شما اضافه شد",
                    color: "green",
                },
            ]);
            return redirect(req, res, 201, backUrl);
        }

        const newQuantity = +isProdcutExsistInUserCart.quantity + +quantity;
        // if quantity gigger than produt quantity in DB
        if (newQuantity > product.stockQuantity) {
            req.flash("errors", [{ msg: "تعداد کالا موجود نیست" }]);
            return redirect(req, res, 401, backUrl);
        }
        //calc user quantity of product
        cart.forEach((p) => {
            if (p.productId === productId) {
                p.quantity = +newQuantity;
            }
        });
        // replace new cart to previeus
        req.session.cart = cart;
        req.flash("success", [
            { msg: "کالا با موفقیت اپدیت شد", color: "green" },
        ]);
        return redirect(req, res, 201, backUrl);
    }
};

exports.cartGet = async function (req, res, next) {
    let products = [];
    try {
        if (!req.session.isAuth) {
            const cart = req.session.cart;
            if (cart.length >= 1) {
                const productIds = cart.map((p) => p.productId);
                const userProducts = await tables.Product.findAll({
                    where: {
                        id: productIds,
                    },
                    include: [
                        {
                            model: tables.Image,
                            as: "productImage",
                            where: { type: "title" },
                        },
                    ],
                });

                cart.forEach((userP) => {
                    const curentProduct = userProducts.find(
                        (p) => p.id === +userP.productId,
                    );

                    products.push({
                        quantity: userP.quantity,
                        product: curentProduct,
                    });
                });
            }
        } else if (req.session.isAuth) {
            const userCart = await tables.Cart.findOne({
                where: {
                    UserId: req.session.userId,
                },
                through: [tables.Product],
            });

            const userProducts = await userCart.getProducts({
                include: [
                    {
                        model: tables.Image,
                        as: "productImage",
                        where: { type: "title" },
                    },
                ],
            });
            userProducts.forEach((p) => {
                products.push({
                    quantity: +p.ProductCart.quantity,
                    product: p,
                });
            });
        }

        const contex = {
            title: "سبد خرید",
            products,
            preLoad: "سبد خرید",
        };
        res.render("cart/cart", contex);
    } catch (error) {
        next(createError(500, error.message));
    }
};
