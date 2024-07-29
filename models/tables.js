const Cart = require('./Cart');
const resetPassword = require('./resetPassowrd')
const Category = require('./Category');
const Comment = require('./Comment');
const Factor = require('./Factor');
const Order = require('./Order');
const Product = require('./Product');
const Ticket = require('./Ticket');
const Type = require('./Type');
const User = require('./User');
const ProductCart = require('./ProductCart')
const attr = require('./attribute')
const image = require('./images');

//1:1
Cart.belongsTo(User)
User.hasOne(Cart)
Category.hasOne(Product);
Product.belongsTo(Category);
resetPassword.belongsTo(User)
User.hasOne(resetPassword)
//1:m
Product.hasMany(image, { as: "productImage", onDelete: "CASCADE" });
image.belongsTo(Product)

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(Type)
Type.belongsTo(User)

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Factor)
Factor.belongsTo(User)


User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

User.hasMany(Ticket)
Ticket.belongsTo(User)


Type.hasMany(Category);
Category.belongsTo(Type);

Product.belongsTo(User)
User.hasMany(Product)

User.hasMany(attr)
attr.belongsTo(User)

// m:m
Product.belongsToMany(Cart, { through: ProductCart })
Cart.belongsToMany(Product, { through: ProductCart })

Order.belongsToMany(Product, { through: "orderProduct" });
Product.belongsToMany(Order, { through: "orderProduct" });

Product.belongsToMany(attr, { through: "productAttribute" });
attr.belongsToMany(Product, { through: "productAttribute" });

module.exports = {
  User,
  Product,
  Category,
  Ticket,
  Comment,
  ProductCart,
  Factor,
  ProductCart,
  Type,
  Attribute: attr,
  Image: image,
  resetPassword
}
