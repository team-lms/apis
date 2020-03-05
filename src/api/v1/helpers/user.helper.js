const { Validator, ApiError, Crypto } = require('../../../utils');
const { ValidationConstant, MessageCodeConstants } = require('../../../constants');
const { UserService } = require("../services");
const userHelper = {

  createNewUser: async (reqbody) => {
    try {
      const userToBeCreated = {
        firstName: reqbody.firstName,
        lastName: reqbody.lastName,
        email: reqbody.email,
        phoneNumber: reqbody.phoneNumber,
        whatsappNumber: reqbody.whatsappNumber,
        deviceToken: reqbody.deviceToken,
        appVersion: reqbody.appVersion,
        password: reqbody.password,
        designation: reqbody.designation,
        role: reqbody.role,
        status: reqbody.status
      }

      const validationResult = Validator.validate(userToBeCreated, {
        firstName: { presence: { allowEmpty: false } },
        email: { presence: { allowEmpty: false }, email: true },
        phoneNumber: {
          presence: { allowEmpty: false },
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH }
        },
        designation: { presenc: { allowEmpty: false } },
        role: { presence: { allowEmpty: false } }
      })

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult)
      }

      // check if a user is present with same email
      UserService.findUserByEmailOrPhone(userToBeCreated.email)




    }
    catch (error) { }
  }

}

module.exports = userHelper
