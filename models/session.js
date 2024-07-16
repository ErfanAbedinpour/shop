const { db } = require('../utils/constant')
const { DataTypes } = require('sequelize')

const session = db.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: DataTypes.STRING,
  expires: DataTypes.DATE,
  data: DataTypes.TEXT,
})

module.exports = session;
