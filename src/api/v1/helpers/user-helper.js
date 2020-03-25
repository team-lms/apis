const {
  Validator, ApiError
} = require('../../../utils');
const {
  MessageCodeConstants
} = require('../../../constants');
// const { UserService } = require('../services');

const UserHelper = {

  loginUser: async (reqBody) => {
    const userToBeLoggedIn = {
      email: reqBody.email,
      password: reqBody.password
    };
    const validationResult = Validator.validate(userToBeLoggedIn, {
      email: { presence: { allowEmpty: false }, email: true },
      password: { presence: { allowEmpty: false } }
    });
    if (validationResult) {
      throw ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
    }
  }
};


module.exports = UserHelper;
