const tables = require('../models/tables');
const table = require('../models/tables');

async function fetchData() {
  const [man, women] = await table.Type.bulkCreate([
    {
      gender: "man"
    },
    {
      gender: "women"
    }
  ]);
  const manCategory = await table.Category.bulkCreate([
    {
      name: "لباس مردانه",
      slug: "man-clothes",
    },
    {
      name: "ساعت مردانه",
      slug: 'man-watch',
    },
  ])
  const womenCategory = await table.Category.bulkCreate([
    {
      name: "ساعت زنانه",
      slug: "women-watch",
    },
    {
      name: "لباس زنانه",
      slug: "women-clothes",
    },
  ])
  man.addCategories(manCategory)
  women.addCategories(womenCategory)

  await tables.User.create({
    username: "erfan",
    email: "milad.wtf44@gmail.com",
    password: "12341234",
    role: 'admin'
  })
  console.log('all data fetched succesfuuly')

}

module.exports = fetchData
