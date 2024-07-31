const createApp = require("./createApp");
const { db } = require("./utils/constant");

const app = createApp(db);

(async function () {
  try {
    await db.authenticate();
    console.log("DB is connected");
    await db.sync();
    // await db.sync({force:true})
    console.log("sync succefully");
    app.listen(8000, () => {
      console.log("server is running on http://localhost:8000");
    });
  } catch (err) {
    console.error(err);
  }
})();
