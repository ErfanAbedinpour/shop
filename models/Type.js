const { db } = require('../utils/constant');
const { DataTypes } = require('sequelize');

const Mode = db.define('Category', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM,
    values: ['man', 'woman'],
    allowNull: false
  }
})
module.exports = Mode 
