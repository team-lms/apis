const nodemailer = require('nodemailer');

module.exports = {
  sendMail: async ({
    from, to, subject, text,
  }) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'siju.samson@enukesoftware.com',
          password: 'Admin123@',
        },
      });
      return transporter.sendMail({
        from: 'siju.samson@enukesoftware.com',
        to: 'rohit.kumar@enukesoftware.com',
        subject: 'Hello',
        text: 'Hello World',
        html: '<b>Hello World?</b>',
      });
    } catch (error) {
      console.log(error);
    }
  },
};
