const authController = require('../controller/auth.c');
const {redirect}  = require('../helper/redirect')
const tables = require('../models/tables');



const mockReq = {
  flash: jest.fn(),
  body: { username: "erfan", password: "12312312", email: "milad.wtf44@gmail.com" },
  params:{
    userId:1
  },
  originalUrl:"/",
  session:{
    save:jest.fn(cb=>cb())
  }
}

const mockRes = {
  status: jest.fn(() => mockRes),
  render: jest.fn(),
  redirect:jest.fn()
}

jest.mock('../helper/messageCls.js', () => ({
  messageRawList: jest.fn(),
  errorMessage: jest.fn()
}));

jest.mock('../models/tables.js')

describe("render pages", function() {
  it('register page', function() {
    authController.getRegister(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.render).toHaveBeenCalled()
  })

  it('login page', function() {
    authController.getLogin(mockReq, mockRes, () => { })
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.render).toHaveBeenCalled()
  })
})


describe('login auth controller', function() {
  beforeEach(()=>{
    mockReq.params.userId = 1;
  })
  it('should be redirect to reditster page when  has error', async function() {
    jest.spyOn(tables.User,'create').mockImplementationOnce(()=>0)
    await authController.postRegister(mockReq, mockRes, () => { })
    expect(tables.User.count).toHaveBeenCalled()
    expect(tables.User.create).toHaveBeenCalled()
    expect(mockReq.flash).toHaveBeenCalledWith('errors', [{
      color: "red",
      msg: "error create user"
    }])
  })

  it('should be return true when user create succesfully', async function() {
    jest.spyOn(tables.User, 'count').mockImplementationOnce(() => 0);
    jest.spyOn(tables.User, 'create').mockImplementationOnce(() => 1);
    await authController.postRegister(mockReq, mockRes, () => { })
    expect(mockReq.flash).toHaveBeenCalled()
    expect(mockReq.flash).toHaveBeenCalledWith('success', [
      {
        color: 'green',
        msg: "اکانت با موفقیت ساخته شد"
      }
    ])
    expect(tables.User.create).toHaveBeenCalledWith({ ...mockReq.body, role: "admin" })
  })

  it('should be reutn error when user id does not exssit',async function(){
    mockReq.params.userId = false;
    await authController.banPost(mockReq,mockRes,()=>{})
    expect(mockReq.flash).toHaveBeenCalled()
    expect(mockReq.flash).toHaveBeenCalledWith('errors', [{
      msg: "userId not found",
      color: 'red'
    }])
  })


  it('should be return error when user does not found in DB',async function(){
    jest.spyOn(tables.User,'findOne').mockImplementationOnce(()=>null);
    await authController.banPost(mockReq,mockRes,()=>{});
    expect(mockReq.flash).toHaveBeenCalledWith('errors', [{ msg: "user not found" }]);
  })

  it('should be user ban', async function(){
    const user = {username:"erfan",email:"asdfljka@gmail.com",save:jest.fn()}
    jest.spyOn(tables.User,'findOne').mockImplementationOnce(()=>user);
    await authController.banPost(mockReq,mockRes,()=>{});
    expect(tables.User.findOne).toHaveBeenCalledWith({where:{id:mockReq.params.userId}});
    expect(user).toEqual({...user,isBan:true})
    expect(user.save).toHaveBeenCalled()
    expect(mockReq.flash).toHaveBeenCalledWith('success', [{
      msg: "user ban successfully",
      color: 'green'
    }])
  })
})


describe('current redirect and session save',function(){

  it('redirect currently after save session',function(){
    redirect(mockReq,mockRes,200,mockReq.originalUrl);
    expect(mockReq.session.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.redirect).toHaveBeenCalledWith(mockReq.originalUrl)
  })


})
