const request = require("supertest");
const createApp = require('../createApp');
process.env.NODE_ENV = 'dev';
const { db } = require('../utils/constant');
const fetchDat = require('../helper/initData');
const { Product } = require("../models/tables");
const supertest = require("supertest");

let app;

async function beforeAllFunc() {
  app = createApp(db);
  await db.authenticate();
  await db.sync()
  await fetchDat()
}

async function afterAllFunc() {
  await db.close();
}

describe('login and insert data and items', function() {
  beforeAll(beforeAllFunc)

  const userBody = {
    email: "milad.wtf44@gmail.com",
    password: "12341234"
  }
  const products = [{
    price: "1203223",
    quantity: "42",
    title: "کفش مردانه",
    describe: "این یکی از بهتری کفش های مردانه است",
    category: "1",
    titleImage: "/home/erfan/Desktop/images/imge1.jpg",
    image: "/home/erfan/Desktop/images/image3.jpg",
    image2: "/home/erfan/Desktop/images/newImages.jpeg"
  }, {
    price: "120000",
    quantity: "50",
    title: "کفش زنانه",
    describe: "این کفش زنانه بسیاز کفش زیبایی است",
    category: "2",
    titleImage: "/home/erfan/Desktop/images/image3.jpg",
    image: "/home/erfan/Desktop/images/newImages.jpeg",
    image2: "/home/erfan/Desktop/images/title.jpg"
  }, {
    price: "539999",
    quantity: "100",
    title: "ساعت رولکس",
    describe: "این ساعت رولکس بسیار بسیار ساعت خوبی است",
    category: "3",
    titleImage: "/home/erfan/Desktop/images/newImages.jpeg",
    image: "/home/erfan/Desktop/images/image3.jpg",
    image2: "/home/erfan/Desktop/images/imge1.jpg"
  }]
  it("login from admin and delete currenct item and new  Items", async function() {
    let resp = await request(app).post("/auth/login").send(userBody);
    const cookie = resp.headers['set-cookie'];
    const deleteTask = []
    const countOfProducts = await Product.count();
    if (countOfProducts >= 1) {
      const products = await Product.findAll();
      for (const p of products) {
        deleteTask.push(supertest(app).post(`/product/delete/${p.id}`));
      }
      await Promise.all(deleteTask);
    }
    const inserTask = [];
    for (let i = 0; i < products.length; i++) {
      inserTask.push(inserProduct(request, app, cookie, products[i]))
    }
    await Promise.all(inserTask)
    expect(await Product.count()).toEqual(3);
  })

  afterAll(afterAllFunc)
})


async function inserProduct(request, app, cookie, item) {
  await (request(app).post("/product/add").set('Cookie', cookie)
    .field('title', item.title)
    .field('description', item.describe)
    .field('category', item.category)
    .field('stockQuantity', item.quantity)
    .field('price', item.price)
    .attach('title', item.titleImage)
    .attach('product', item.image)
    .attach('product', item.image2))
}
