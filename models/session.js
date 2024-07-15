const { db } = require('../utils/constant')

const session = db.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
})

module.exports = session;
