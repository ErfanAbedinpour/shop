const nodemailer = require("nodemailer");

class Email {
  constructor() {
    this.email = process.env.EMAIL;
    this.password = process.env.PASSWORD;

    this.transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
  }

  async sendMail(to, subject, content) {
    try {
      await this.transport.sendMail({
        to,
        subject,
        html: content,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = Email;
