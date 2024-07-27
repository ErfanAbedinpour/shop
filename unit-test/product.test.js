const productController = require('../controller/product.c');
const compressImg = require('../helper/compressImg');
const tables = require('../models/tables');
const path = require('path');
const fs = require('fs').promises;



const product = { title: "titile", stockQuantity: 1, description: "description", price: 122222 }
const mockReq = {
    flash: jest.fn(),
    body: product,
    params: {
        userId: 1,
        productId: 1
    },
    session: {
        save: jest.fn()
    },
    originalUrl: "/",
    session: {
        save: jest.fn(),
        csrf: { token: "", secret: "" }
    },
    user: {
        addProduct: jest.fn()
    },
    files: {
        product: {
            concat: jest.fn(() => ({
                map: jest.fn(() => [])
            }))
        },
        title: [{}],
    },
    category: 2
}

const mockRes = {
    status: jest.fn(() => mockRes),
    render: jest.fn(),
    redirect: jest.fn()
}

jest.mock('../helper/compressImg', () => ({
    compressImg: jest.fn(() => Promise.resolve({}))
}))
const next = jest.fn()

jest.mock('../helper/messageCls.js', () => ({
    messageRawList: jest.fn(),
    errorMessage: jest.fn()
}));
jest.mock('../models/tables.js');
jest.mock('path');
jest.mock('fs', () => ({
    promises: {
        unlink: jest.fn(),
    }
}));


describe('render pages succes', function() {
    it('render add product page', async function() {
        await productController.getCreate(mockReq, mockRes, () => { });
        expect(mockReq.flash).toHaveBeenCalled()
        expect(tables.Category.findAll).toHaveBeenCalled();
        expect(mockRes.render).toHaveBeenCalled()
    })

    it('faild to render must be send error', async function() {
        const findAllMock = jest.spyOn(tables.Category, 'findAll').mockImplementationOnce(() => Promise.reject('faild to fetch datas'))
        await productController.getCreate(mockReq, mockRes, next);
        expect(mockReq.flash).toHaveBeenCalled();
        expect(findAllMock).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith("faild to fetch datas")
    })
})


describe('product login test', function() {
    it("create product", async function() {
        const mockProductFn = jest.spyOn(tables.Product, 'create').mockImplementationOnce((product) => ({ ...product, addProductImage: jest.fn() }));
        // jest.spyOn(tables.Image,'bulkCreate').mockImplementationOnce()
        await productController.createProduct(mockReq, mockRes, next)
        expect(tables.Product.create).toHaveBeenCalledWith({
            title: product.title,
            describe: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            CategoryId: mockReq.category
        })
        const mockProduct = mockProductFn.mock.results[0].value;
        expect(mockReq.user.addProduct).toHaveBeenCalledWith(mockProduct);
        expect(mockReq.files.product.concat).toHaveBeenCalledWith(mockReq.files.title);
        expect(tables.Image.bulkCreate).toHaveBeenCalled()
        expect(mockReq.flash).toHaveBeenCalledWith('success', [{
            msg: "کالا با موقیت اضافه شد",
            color: 'green'
        }])
        expect(next).not.toHaveBeenCalled()
    })
    it("error when create product", async function() {
        const mockProductFn = jest.spyOn(tables.Product, 'create').mockImplementationOnce((product) => (Promise.reject('faild to create user')));
        await productController.createProduct(mockReq, mockRes, next)
        expect(next).toHaveBeenCalled()
    })

    it('should be return error when product id in invalid', async function() {
        const mockReqInternal = { ...mockReq, params: { productId: 0 } }
        await productController.deleteProduct(mockReqInternal, mockRes, next);
        expect(mockReq.flash).toHaveBeenCalledWith('errors', [{ msg: "درخواست معتبر نیست", color: 'red' }])
    })

    it('should be return false when cannot find product in DB', async function() {
        jest.spyOn(tables.Product, 'findOne').mockImplementationOnce(() => false)
        await productController.deleteProduct(mockReq, mockRes, next);
        expect(mockReq.flash).toHaveBeenCalledWith('errors', [{ msg: "کالا پیدا نشد", color: 'red' }])
    })

    it('should be delete product ', async function() {
        const findOneMock = jest.spyOn(tables.Product, 'findOne').mockReturnValueOnce({
            ...product,
            destroy: jest.fn().mockResolvedValue(),
            save: jest.fn().mockResolvedValue(),
            productImage: [
                { fileanme: "image.jpg" },
                { fileanme: "iamge2.jpg" }
            ]
        })
        fs.unlink.mockResolvedValue();
        await productController.deleteProduct(mockReq, mockRes, next);
        expect(path.join).toHaveBeenCalled();
        expect(fs.unlink).toHaveBeenCalled();
        expect(mockReq.flash).toHaveBeenCalledWith('success', [{
            msg: "product removed succesfully",
            color: 'green'
        }])
    })
})
