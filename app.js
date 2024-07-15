const app = require('./server');
const { db } = require('./utils/constant');
(async function() {
  try {
    await db.authenticate();
    console.log('DB is connected');
    await db.sync({ logging: false })
    console.log('sync succefully');
    app.listen(8000, () => { console.log('server is running on http://localhost:8000') })
  } catch (err) {
    console.error(err)
  }
})();
