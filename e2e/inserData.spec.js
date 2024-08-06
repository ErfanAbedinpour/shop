process.env.NODEENV = "dev";
const createApp = require("../createApp");
const jsdom = require("jsdom");
const jQuery = require("jquery")(new jsdom.JSDOM().window);
const fetchDat = require("../helper/initData");
const request = require("supertest");
const { db } = require("../utils/constant");
const { Product } = require("../models/tables");

let app;

async function beforeAllFunc() {
  app = createApp(db);
  await db.authenticate();
  await db.sync({ force: true });
  await fetchDat();
}

async function afterAllFunc() {
  await db.close();
}

describe("login and insert data and items", function () {
  beforeAll(beforeAllFunc);

  const userBody = {
    email: "milad.wtf44@gmail.com",
    password: "12341234",
  };
  const products = [
    {
      brand:"HugoBoss",
      title: "تیشرت مردانه",
      price: 299000,
      category: 1,
      shortDescribe: "تیشرت نخی با کیفیت بالا",
      longDescribe:
        "این تیشرت از جنس نخی مرغوب ساخته شده و مناسب برای استفاده روزمره است. دارای دوخت محکم و دوام بالا میباشد.",
      image: "/home/erfan/Desktop/images/imge1.jpg",
      image2: "/home/erfan/Desktop/images/image3.jpg",
      titleImage: "/home/erfan/Desktop/images/title.jpg",
      quantity: 0,
    },
    {
      brand:"allien",
      title: "پیراهن زنانه",
      price: 499000,
      category: 2,
      shortDescribe: "پیراهن زیبا و شیک",
      longDescribe:
        "این پیراهن زنانه با طراحی زیبا و رنگهای جذاب، مناسب برای مهمانیها و مجالس میباشد. جنس پارچه آن بسیار نرم و راحت است.",
      image: "/home/erfan/Desktop/images/image3.jpg",
      image2: "/home/erfan/Desktop/images/title.jpg",
      titleImage: "/home/erfan/Desktop/images/imge1.jpg",
      quantity: 30,
    },

    {
      brand:"eton",
      title: "شلوار جین",
      price: 399000,
      category: 3,
      shortDescribe: "شلوار جین با دوام و شیک",
      longDescribe:
        "این شلوار جین از بهترین نوع جین ساخته شده و دارای طراحی مدرن و جوان پسند است. مناسب برای استفاده روزمره و مجالس غیررسمی.",
      image: "/home/erfan/Desktop/images/newImages.jpeg",
      image2: "/home/erfan/Desktop/images/title.jpg",
      titleImage: "/home/erfan/Desktop/images/image3.jpg",
      quantity: 40,
    },
  ];

  it("login from admin and delete currenct item and new  Items", async function () {
    let resp = await request(app).get("/auth/login");
    let HTML = jQuery(resp.text);
    let token = HTML.find("input[name=csrf_token]").val();
    const cookie = resp.headers["set-cookie"];
    resp = await request(app)
      .post("/auth/login")
      .set("Cookie", cookie)
      .send({ ...userBody, csrf_token: token });
    const deleteTask = [];
    const countOfProducts = await Product.count();
    if (countOfProducts >= 1) {
      const productsInDB = await Product.findAll();
      for (const p of productsInDB) {
        deleteTask.push(
          request(app).post(`/product/delete/${p.id}`).set("Cookie", cookie),
        );
      }
      await Promise.all(deleteTask);
    }
    for (let i = 0; i < products.length; i++) {
      await inserProduct(request, app, cookie, products[i]);
    }
    expect(await Product.count()).toEqual(3);
  });

  afterAll(afterAllFunc);
});

async function inserProduct(request, app, cookie, item) {
  let resp = await request(app).get("/product/add").set("Cookie", cookie);
  let HTML = jQuery(resp.text);
  let token = HTML.find("input[name=csrf_token]").val();
  await request(app)
    .post("/product/add")
    .set("Cookie", cookie)
    .field('brand',item.brand)
    .field("title", item.title)
    .field("shortDescribe", item.shortDescribe)
    .field("longDescribe", item.longDescribe)
    .field("category", item.category)
    .field("stockQuantity", item.quantity)
    .field("price", item.price)
    .field("csrf_token", token)
    .attach("title", item.titleImage)
    .attach("product", item.image)
    .attach("product", item.image2);
  return true;
}
