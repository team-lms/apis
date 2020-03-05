const bcrypt = require('bcryptjs');
const {
  Validator, ApiError, Crypto, Response,
} = require('../../../utils');
const {
  ValidationConstant, MessageCodeConstants, RolesConstants, StatusCodeConstants,
} = require('../../../constants');
const { UserService } = require('../services');

const UserHelper = {

  createNewUser: async (reqbody) => {
    try {
      const userToBeCreated = {
        firstName: reqbody.firstName,
        lastName: reqbody.lastName,
        email: reqbody.email,
        phoneNumber: `${reqbody.phoneNumber}`,
        whatsappNumber: `${reqbody.whatsappNumber || ''}` || null,
        deviceToken: reqbody.deviceToken,
        appVersion: reqbody.appVersion,
        password: reqbody.password,
        designation: reqbody.designation,
        role: reqbody.role,
        status: reqbody.status,
      };

      const validationResult = Validator.validate(userToBeCreated, {
        firstName: { presence: { allowEmpty: false } },
        email: { presence: { allowEmpty: false }, email: true },
        phoneNumber: {
          presence: { allowEmpty: false },
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH },
        },
        whatsappNumber: {
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH },
        },
        designation: { presence: { allowEmpty: false } },
        role: { presence: { allowEmpty: false } },
      });

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      // check if a user is present with same email
      if (await UserService.findUserByEmailOrPhone(userToBeCreated.email)) {
        throw ApiError.ResourceAlreadyExistError(MessageCodeConstants.EMAIL_ALREADY_EXISTS);
      }

      // check if a user is present with same phone number
      if (await UserService.findUserByEmailOrPhone(userToBeCreated.phoneNumber)) {
        throw ApiError.ResourceAlreadyExistError(MessageCodeConstants.PHONE_ALREADY_EXISTS);
      }

      userToBeCreated.role = RolesConstants.EMPLOYEE;
      const password = Crypto.randomBytes(4);
      userToBeCreated.password = await bcrypt.hash(password, 10);
      let createdUser = {};
      userToBeCreated.casualLeaves = 0;
      userToBeCreated.bufferLeaves = 0;
      userToBeCreated.unAuthorizedLeaves = 0;
      createdUser = await UserService.createUser(userToBeCreated);
      return {
        success: true,
        data: Response.sendSuccess(
          MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
          {
            user: {
              id: createdUser.id,
              firstName: createdUser.firstName,
              lastName: createdUser.lastName,
              email: createdUser.email,
              phoneNumber: createdUser.phoneNumber,
              whatsappNumber: createdUser.whatsappNumber,
              designation: createdUser.designation,
              role: createdUser.role,
              status: createdUser.status,
              createdAt: createdUser.createdAt,
              updatedAt: createdUser.updatedAt,
            },
          },
          StatusCodeConstants.SUCCESS,
        ),
        error: {},
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error = {} }) {
      return {
        success: false,
        data: {},
        error: Response.sendError(message, error, code),
      };
    }
  },

};

module.exports = UserHelper;
