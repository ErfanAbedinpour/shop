const { db } = require('../utils/constant')
const { DataTypes } = require("sequelize")


const Cart = db.define("Cart", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
}, {
  updatedAt: false
})

module.exports = Cart
