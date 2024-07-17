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
  await table.Category.bulkCreate([
    {
      name: "لباس مردانه",
      slug: "man-clothes",
      TypeId: man.id
    },
    {
      name: "لباس زنانه",
      slug: "women-clothes",
      TypeId: women.id
    },
    {
      name: "ساعت مردانه",
      slug: 'man-watch',
      TypeId: man.id
    },
    {
      name: "ساعت زنانه",
      slug: "women-watch",
      TypeId: women.id
    }
  ])

  console.log('all data fetched succesfuuly')

}

module.exports = fetchData
