const { db } = require('../utils/constant')
const { DataTypes } = require('sequelize')


const resetPassword = db.define('resetPassword', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.TEXT('medium'),
    allowNull: false,
  },
  expireTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
})


module.exports = resetPassword
