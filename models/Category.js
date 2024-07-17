const { db } = require('../utils/constant');
const { DataTypes } = require('sequelize');

const Category = db.define('Category', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    unique: true,
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
})
module.exports = Category
