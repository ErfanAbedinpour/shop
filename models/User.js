const { db } = require('../utils/constant');
const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

const user = db.define('User', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        defaultValue: 'user'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    updatedAt: false
});


//hash pass before create 
user.beforeCreate((user, option) => {
    bcrypt.genSalt(12, (salt) => {
        bcrypt.hash(user.password, salt, (hashPass) => {
            user.password = hashPass
        })
    })
})
module.exports = user;

