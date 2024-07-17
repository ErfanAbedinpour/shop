const { db } = require('../utils/constant')
const { DataTypes } = require("sequelize")


const Comment = db.define("Comment", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  updatedAt: false
})

module.exports = Comment
