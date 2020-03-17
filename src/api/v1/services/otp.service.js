const pug = require('pug');
const path = require('path');
const { Otp } = require('../../../../models');
const { StatusConstants, EmailConstants } = require('../../../constants');
const { Otps, Mailer } = require('../../../utils');

const OtpService = {

  sendOtp: async (user) => {
    const randomOtp = Otps.generateOtp();
    await Otp.update(
      { status: StatusConstants.INACTIVE },
      { where: { userId: user.id, status: StatusConstants.ACTIVE } }
    );
    const otp = await Otp.create({
      userId: user.id,
      otp: randomOtp,
      status: StatusConstants.ACTIVE
    });
    OtpService.sendOtpToEmail(user, otp);
    return randomOtp;
  },

  sendOtpToEmail: async ({ email }, { otp }) => {
    const html = await pug.renderFile(path.join(__dirname, '../../../templates/send-otp.pug'), {
      otp
    });
    Mailer.sendMail({
      to: email,
      subject: EmailConstants.OTP_RESET_PASSWORD,
      html
    });
  },

  getOtpByUserId: async ({ id }) => Otp.findOne({
    where: {
      userId: id,
      status: StatusConstants.ACTIVE
    }
  })
};

module.exports = {
  OtpService
};
