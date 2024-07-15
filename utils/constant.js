const { Sequelize } = require('sequelize');

exports.db = new Sequelize('mysql', process.env.DBHOST, process.env.DBPASS, {
    dialect: "mysql",
    database: process.env.DBNAME
})
