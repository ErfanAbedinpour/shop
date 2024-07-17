const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')

Product.hasOne(User);
Product.hasOne(Category);

Category.hasOne(User);

module.exports = {
  User,
  Product,
  Category
}
