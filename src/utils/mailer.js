const nodemailer = require('nodemailer');

module.exports = {
  sendMail: async ({
    to, subject, html,
  }) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secureConnection: false,
        auth: {
          user: 'siju.samson@enukesoftware.com',
          pass: 'Admin123@',
        },
      });
      return transporter.sendMail({
        from: 'siju.samson@enukesoftware.com',
        to,
        subject,
        html,
      });
    } catch (error) {
      return error;
    }
  },
};
