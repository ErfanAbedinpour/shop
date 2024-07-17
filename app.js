const app = require('./server');
const { db } = require('./utils/constant');
const fetchData = require('./helper/initData');
(async function() {
  try {
    await db.authenticate();
    console.log('DB is connected');
    await db.sync({ logging: false, force: true })
    console.log('sync succefully');
    await fetchData()
    app.listen(8000, () => { console.log('server is running on http://localhost:8000') })
  } catch (err) {
    console.error(err)
  }
})();
