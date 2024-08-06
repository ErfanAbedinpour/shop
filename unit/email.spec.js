const Email = require("../utils/email");
const nodemailer = require("nodemailer");

jest.mock("nodemailer");

it("test for send Email succesfully", async function () {
  const mockUser = { email: "erfan.wtf44@gmail.com" };
  const e = new Email();
  e.transport = {
    sendMail: jest.fn(),
  };
  await e.sendMail(
    mockUser.email,
    "hello",
    `<h1>this is a test with jest</h1>`,
  );
  expect(nodemailer.createTransport).toHaveBeenCalled();
  expect(e.transport.sendMail).toHaveBeenCalled();
  expect(e.transport.sendMail).toHaveBeenCalledWith({
    to: mockUser.email,
    subject: "hello",
    html: `<h1>this is a test with jest</h1>`,
  });
});
