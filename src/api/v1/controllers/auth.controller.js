const bcrypt = require('bcryptjs');
const Chalk = require('chalk');
const { UserService, JwtService } = require('../services');
const { Validator, ApiError, Response } = require('../../../utils');
const { MessageCodeConstants, StatusCodeConstants, StatusConstants } = require('../../../constants');

module.exports = {
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
};
