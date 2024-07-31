const { db } = require("../utils/constant");
const { DataTypes } = require("sequelize");

const Factor = db.define(
  "Factor",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    factor_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  },
);

module.exports = Factor;
