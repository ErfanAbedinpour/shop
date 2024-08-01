const { db } = require("../utils/constant");
const { DataTypes } = require("sequelize");

const Product = db.define("Product", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescribe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longDescribe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  brand:{
    type:DataTypes.STRING,
    alloNull:false,
  },
  star:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
});

module.exports = Product;
