const tables = require("../models/tables.js");
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
        //find product if product exsist continio
        const product = await tables.Product.findOne({
            where: { id: +productId, stockQuantity: { [op.gte]: 1 } },
        });
        //get backUrl for send response
        const backUrl = `/product/${productId}`;
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
        req.flash("success", [{ msg: "کالا با موفقیت اضافه شد" }]);
        return redirect(req, res, 201, backUrl);
    } catch (error) {
        next(createError(500, error.message));
    }
};
