const { db } = require('../utils/constant')
const { DataTypes } = require('sequelize')
const Cart = require('./Cart')
const Product = require('./Product')

const productId = db.define("ProductCart", {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  ProductId: {
    type: DataTypes.BIGINT,
    references: {
      model: Product,
      key: "id"
    }
  },
  CartId: {
    type: DataTypes.BIGINT,
    references: {
      model: Cart,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.NUMBER,
    allowNull: false
  }
})

module.exports = productId
