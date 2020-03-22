const bcrypt = require('bcryptjs');
const Chalk = require('chalk');
const moment = require('moment');
const { UserService, JwtService, OtpService } = require('../services');
const { Validator, ApiError, Response } = require('../../../utils');
const { MessageCodeConstants, StatusCodeConstants, StatusConstants } = require('../../../constants');

module.exports = {
  /**
   * To Login
   */
  login: async (req, res) => {
    try {
      const userToBeLoggedIn = req.body;
      const validationResult = Validator.validate(userToBeLoggedIn, {
        email: { presence: { allowEmpty: false }, email: true },
        password: { presence: { allowEmpty: false } },
      });
      if (validationResult) {
        throw ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      const foundUser = await UserService.findUserByEmailOrPhone({ email: userToBeLoggedIn.email });
      if (foundUser) {
        if (await bcrypt.compare(userToBeLoggedIn.password, foundUser.password)) {
          if (foundUser.status === StatusConstants.ACTIVE) {
            return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
              MessageCodeConstants.USER_FETCHED_SUCCESSFULLY,
              JwtService.generateJwtToken(foundUser),
              StatusCodeConstants.SUCCESS,
            ));
          }
          throw new ApiError.ValidationError(MessageCodeConstants.USER_INACTIVE);
        }
        throw new ApiError.ValidationError(MessageCodeConstants.PASSWORD_INCORRECT);
      }
      throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },

  /**
   * To send Otp
   */
  sendOtp: async (req, res) => {
    try {
      const userDetails = req.body;
      const validationResult = Validator.validate(userDetails, {
        userId: { presence: { allowEmpty: false } }
      });

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      const foundUser = await UserService.findUserByEmailOrPhone({
        email: userDetails.userId,
        phoneNumber: userDetails.userId
      });

      if (foundUser) {
        OtpService.sendOtp(foundUser);
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.OTP_SENT_SUCCESSFULLY,
          {},
          StatusCodeConstants.SUCCESS
        ));
      }
      throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json({
        message,
        error,
        code
      });
    }
  },

  /**
   * Verify Otp
   */

  verifyOtp: async (req, res) => {
    try {
      const userPasswordChange = req.body;
      const validationResult = Validator.validate({
        userId: { presence: { allowEmpty: false } },
        otp: { presence: { allowEmpty: false } },
        password: { presence: { allowEmpty: false } }
      });

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      const foundUser = await UserService.findUserByEmailOrPhone({
        email: userPasswordChange.userId,
        phoneNumber: userPasswordChange.userId
      });
      if (foundUser) {
        const foundOtp = await OtpService.getOtpByUserId(foundUser);
        if (foundOtp && `${foundOtp.otp}` === `${userPasswordChange.otp}`) {
          const otpDuration = moment.utc().diff(moment.utc(foundOtp.createdAt), 'minute');
          if (otpDuration <= Number(process.env.OTP_DURATION)) {
            userPasswordChange.password = await bcrypt.hash(userPasswordChange.password, 10);
            await UserService.updateUser(userPasswordChange, foundUser);
            return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
              MessageCodeConstants.PASSWORD_UPDATED_SUCCESSFULLY,
              {},
              StatusCodeConstants.SUCCESS
            ));
          }
          throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR,
            MessageCodeConstants.OTP_EXPIRED);
        } throw new ApiError.ValidationError(MessageCodeConstants);
      } throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json({
        message,
        error,
        code
      });
    }
  }
};
