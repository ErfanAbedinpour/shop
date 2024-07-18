const { Sequelize } = require('sequelize');
const { createClient } = require('redis')

const username = process.env.DBUSERNAME;
const pass = process.env.DBPASS
const host = process.env.DBHOST
const name = process.env.DBNAME
exports.db = new Sequelize(name, username, pass, {
    dialect: "mysql",
    host: host,
    logging: false
})

const redis = createClient();

redis.connect().then(() => {
    console.log('redis connected succesfully')
}).catch(() => {
    console.error('faild to connect redis')
})

exports.redis = redis


