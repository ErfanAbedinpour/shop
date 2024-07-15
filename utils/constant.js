const { Sequelize } = require('sequelize');

const username = process.env.DBUSERNAME;
const pass = process.env.DBPASS
const host = process.env.DBHOST
const name = process.env.DBNANE
exports.db = new Sequelize(name, username, pass, {
    dialect: "mysql",
    host: host
})
