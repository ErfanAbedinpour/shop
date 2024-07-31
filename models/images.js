const { DataTypes } = require("sequelize");
const { db } = require("../utils/constant");

const image = db.define("image", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["title", "product"],
    allowNull: false,
  },
});

module.exports = image;
