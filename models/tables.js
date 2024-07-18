const { DataType, DataTypes } = require('sequelize');
const Cart = require('./Cart');
const Category = require('./Category');
const Comment = require('./Comment');
const Factor = require('./Factor');
const Order = require('./Order');
const Product = require('./Product');
const Ticket = require('./Ticket');
const Type = require('./Type');
const User = require('./User');
const ProductCart = require('./ProductCart')

//1:1
Cart.belongsTo(User)
User.hasOne(Cart)
//1:m

User.hasMany(Category)
Category.belongsTo(User)

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

// m:m
Product.belongsToMany(Cart, { through: ProductCart })
Cart.belongsToMany(Product, { through: ProductCart })

Order.belongsToMany(Product, { through: "orderProduct" });
Product.belongsToMany(Order, { through: "orderProduct" });
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
}
