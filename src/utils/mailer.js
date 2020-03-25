const nodemailer = require('nodemailer');

module.exports = {
  sendMail: async ({
    to, subject, html
  }) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST_NAME,
        port: process.env.SMTP_PORT_NO,
        secureConnection: process.env.SMTP_SECURE_CONNECTION,
        auth: {
          user: process.env.SMTP_USER_NAME,
          pass: process.env.SMTP_PASSWORD
        }
      });
      return transporter.sendMail({
        from: process.env.SMTP_USER_NAME,
        to,
        subject,
        html
      });
    } catch (error) {
      return error;
    }
  }
};
