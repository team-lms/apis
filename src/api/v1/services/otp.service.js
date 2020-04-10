const pug = require('pug');
const path = require('path');
const { Otp } = require('../../../../models');
const { StatusConstants, EmailConstants } = require('../../../constants');
const { Otp: OtpUtil, Mailer } = require('../../../utils');

const OtpService = {

  /**
   * Create and send OTP to user
   */
  sendOtp: async (user) => {
    const randomOtp = OtpUtil.generateOtp();

    // Need to update the OTP synchronously
    Otp.update(
      { status: StatusConstants.INACTIVE },
      { where: { userId: user.id, status: StatusConstants.ACTIVE } }
    );
    const createdOtp = await Otp.create({
      userId: user.id,
      otp: randomOtp,
      status: StatusConstants.ACTIVE
    });
    OtpService.sendOtpToEmail(user, createdOtp);
    return randomOtp;
  },

  /**
   * Send registration OTP to user's email
   */
  sendOtpToEmail: async ({ email }, { otp }) => {
    const html = await pug.renderFile(
      path.join(__dirname, '../../../templates/send-otp.pug'),
      { otp }
    );
    Mailer.sendMail({
      to: email,
      subject: EmailConstants.OTP_RESET_PASSWORD,
      html
    });
  },

  /**
   * Update OTP by id
   */
  updateOtpById: async (id, updatedOtp, transaction = null) => Otp.update(
    updatedOtp,
    { where: { id }, ...(transaction && { transaction }) }
  ),

  /**
   * Get OTP by user id
   */
  getOtpByUserId: async (userId) => Otp.findOne({
    where: {
      userId,
      status: StatusConstants.ACTIVE
    }
  })

};


module.exports = OtpService;
