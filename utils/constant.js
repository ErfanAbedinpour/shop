const { Sequelize } = require("sequelize");
const config = require("../config/db.config.js");

console.log(config);
exports.db = new Sequelize(config.DB, config.USERNAME, config.PASSWORD, {
    dialect: config.DIALECT,
    host: config.HOST,
    port: config.PORT,
    logging: false,
});
