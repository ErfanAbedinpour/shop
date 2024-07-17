const { db } = require('../utils/constant')
const { DataTypes } = require("sequelize")


const Order = db.define("Order", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'send', 'done'],
    defaultValue: 'pending'
  }
}, {
  updatedAt: false
})

module.exports = Order 
