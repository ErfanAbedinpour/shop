const request = require("supertest");
const createApp = require('../createApp');
process.env.NODE_ENV = 'test';
const { db } = require('../utils/constant');
const { User, Image, Product } = require('../models/tables')
const fetchDat = require('../helper/initData');

let app;

async function beforeAllFunc() {
    await db.authenticate();
    await db.sync({ force: true });
    await fetchDat()
    app = createApp(db);
}

async function afterAllFunc() {
    await db.drop()
    await db.close();
}

describe('render page is good', function() {
    beforeAll(beforeAllFunc)
    it('GET / for see orignal page is rendered with 200 status Code', async function() {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    })

    it('GET /404 page must be show with 404 statusCode', async function() {
        const response = await request(app).get('/404');
        expect(response.statusCode).toBe(404)
    })

    it('GET /auth/register should be render register page', async function() {
        const response = await request(app).get('/auth/register');
        expect(response.statusCode).toBe(200)
    })

    it('GET /auth/login should be render login page', async function() {
        const response = await request(app).get('/auth/login');
        expect(response.statusCode).toBe(200)
    })

    it("/GET /product/add should be return 302 because user does not login must be redirect", async function() {
        const resp = await request(app).get('/product/add');
        expect(resp.statusCode).toBe(302);
        expect(resp.redirect).toEqual(true);
        expect(resp.headers['location']).toEqual('/auth/login');
    })

})


describe('auth user ', function() {
    const body = {
        username: "erfan",
        email: "erfan.wtf@gamil.com",
        password: '12341234',
        confirmPassword: "12341234"
    }
    beforeAll(beforeAllFunc)

    it('/POST /auth/register shoudnt be singin ', async function() {
        const resp = await request(app).post('/auth/register').send({
            username: "erfan",
            email: "erfan.wtf",
            password: '12341234',
            confirmPassword: "12341234"
        })
        expect(resp.headers.location).toBe('/auth/register');
    })

    it('/POST /auth/register should be singin', async function() {
        const resp = await request(app).post('/auth/register').send(body);
        expect(resp.headers.location).toBe('/auth/login');
    })

    it('/POST /auth/login should be faild to login', async function() {
        let resp = await request(app).post('/auth/login').send({ ...body, email: "erfan@gad.com" });
        expect(resp.headers.location).toBe('/auth/login');
    })

    it('/POST /auth/login should be login true with user role and must 404 error when user requeat to product add page', async function() {
        let resp = await request(app).post('/auth/login').send(body);
        expect(resp.headers.location).toBe('/');
        const user = await User.findOne({ where: { username: body.username } });
        expect(user.username).toBe(body.username);
        const cookie = resp.headers['set-cookie'];
        resp = await request(app).get('/product/add').set('Cookie', cookie);
        expect(resp.statusCode).toBe(404);
    })
    it('/POST /product/add Show page and login with admin account and inser one product and after delete it ', async function() {
        //login
        let resp = await request(app).post('/auth/login').send({
            email: "milad.wtf44@gmail.com",
            password: "12341234"
        })
        expect(resp.headers.location).toBe("/");
        const cookie = resp.headers['set-cookie'];
        //get product page
        resp = await request(app).get('/product/add').set('Cookie', cookie);
        expect(resp.statusCode).toBe(200);
        //insert product
        resp = await request(app).post('/product/add').set('Cookie', cookie)
            .field('title', "testProduct")
            .field('description', 'description')
            .field('price', '120000')
            .field('stockQuantity', '42')
            .field('category', '1')
            .attach('title', "/home/erfan/Desktop/images/imge1.jpg")
            .attach('product', "/home/erfan/Desktop/images/title.jpg")
        let product = await Product.findOne({ where: { title: 'testProduct' }, include: ['productImage'] })
        expect(product.title).toStrictEqual("testProduct")
        expect(product.describe).toStrictEqual('description')
        expect(product.price).toStrictEqual('120000')
        expect(product.stockQuantity).toStrictEqual(42)
        expect(product.CategoryId).toStrictEqual(1);
        expect(product.UserId).toStrictEqual(1)
        expect((await product.productImage).length).toStrictEqual(2);
        //delete product
        resp = await request(app).post(`/product/delete/${product.id}`).set('Cookie', cookie)
        product = await Product.findOne({ where: { id: product.id } });
        expect(product).toBe(null);
    })

    afterAll(afterAllFunc)
})
