const { db } = require('../utils/constant')
const { DataTypes } = require('sequelize')

const Product = db.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  describe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  star: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})


module.exports = Product
