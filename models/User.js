const {db} = require('../utils/constant');
const {DataTypes} = require('sequelize')

const user = db.define('User',{
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type:DataTypes.ENUM,
        values:['admin','user'],
        defaultValue:'user'
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

module.exports = user;