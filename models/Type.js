const { db } = require('../utils/constant');
const { DataTypes } = require('sequelize');

const Type = db.define('Types', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  gender: {
    type: DataTypes.ENUM,
    values: ['man', 'women'],
    allowNull: false
  }
})
module.exports = Type
module.exports = Mode 
