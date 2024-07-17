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
    type: DataTypes.ENUM,
    values: ['اکسسوری', 'کیف و کوله پشتی', 'کت و شلوار', 'پوشاک'],
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM,
    values: ['زنانه', 'مردانه'],
    allowNull: false
  },
})
module.exports = Category
