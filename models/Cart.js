const { db } = require("../utils/constant");
const { DataTypes } = require("sequelize");

const Cart = db.define(
  "Cart",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  },
);

module.exports = Cart;
