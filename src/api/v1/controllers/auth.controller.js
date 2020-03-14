const bcrypt = require('bcryptjs');
const { UserHelper } = require('../helpers');
const { UserService } = require('../services');
const { Validator, ApiError, Response } = require('../../../utils');
const { MessageCodeConstants, StatusCodeConstants } = require('../../../constants');

module.exports = {
  login: async (req, res) => {
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
      if (await bcrypt.compare(foundUser.password, userToBeLoggedIn.password)) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.USER_FETCHED_SUCCESSFULLY,
          {

          }

        ));
      }
      throw new ApiError.ValidationError(MessageCodeConstants.PASSWORD_INCORRECT);
    }
    throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
  },
};
