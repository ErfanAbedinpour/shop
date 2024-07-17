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
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    updatedAt: false
});


//hash pass before create 
user.beforeCreate(async (user, option) => {
    const salt = await bcrypt.genSalt(12);
    const hashPass = await bcrypt.hash(user.password, salt);
    user.password = hashPass
})
module.exports = user;

