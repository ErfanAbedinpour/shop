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
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  titleImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})


module.exports = Product
