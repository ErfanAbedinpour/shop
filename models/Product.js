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
  sizes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sizeType: {
    type: DataTypes.ENUM,
    values: ['S', 'M', 'L', 'XL', 'FR'],
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})


module.exports = Product
