const {Sequelize} = require('sequelize');

exports.db = new Sequelize('mysql','root','12341234',{
    dialect:"mysql",
    database:"shop"
})
