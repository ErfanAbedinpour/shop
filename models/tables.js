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



Type.hasOne(Category, {
  foreignKey: {
    allowNull: false,
    type: DataTypes.BIGINT
  }
});
Category.belongsTo(Type);

Cart.hasOne(Order, {
  foreignKey: {
    allowNull: false,
    type: DataTypes.BIGINT
  }
});
Order.belongsTo(Cart);

Order.hasOne(Factor, {
  foreignKey: {
    allowNull: false,
    type: DataTypes.BIGINT
  }
});
Factor.belongsTo(Order);

User.hasOne(Factor, {
  foreignKey: {
    allowNull: false,
    type: DataTypes.BIGINT
  }
});
Factor.belongsTo(User);

Category.hasOne(Product);
Product.belongsTo(Category);

//one to many

User.hasMany(Ticket);
Ticket.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Comment)
Comment.belongsTo(User)

Product.hasMany(Comment)
Comment.belongsTo(Product)


// many to many

Cart.belongsToMany(Product, { through: ProductCart })
Product.belongsToMany(Cart, { through: ProductCart })

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
