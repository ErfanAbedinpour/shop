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
    type: DataTypes.NUMBER,
    allowNull: false
  },
  sizeType: {
    type: DataTypes.ENUM,
    values: ['S', 'M', 'L', 'XL', 'FR'],
    allowNull: false
  },
  star: {
    type: DataTypes.NUMBER,
    defaultValue: 2
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  quantity: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})


module.exports = Product
