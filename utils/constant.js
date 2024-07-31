const { Sequelize } = require("sequelize");

const username = process.env.DBUSERNAME;
const pass = process.env.DBPASS;
const host = process.env.DBHOST;
if (process.env.NODE_ENV === "dev") {
  process.env.DBNAME = "shop";
} else if (process.env.NODE_ENV === "test") {
  process.env.DBNAME = "testDB";
}
const name = process.env.DBNAME;
console.log("DB name is ", name);

exports.db = new Sequelize(name, username, pass, {
  dialect: "mysql",
  host: host,
  logging: false,
});
