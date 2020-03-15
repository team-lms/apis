const Chalk = require('chalk');
const bcrypt = require('bcryptjs');
const pug = require('pug');
const path = require('path');


const { UserService } = require('../services');
const {
  Response, Validator, ApiError, Crypto, Mailer
} = require('../../../utils');
const {
  StatusCodeConstants, ValidationConstant, MessageCodeConstants, RolesConstants
} = require('../../../constants');

module.exports = {
  /**
   * To create a user.
   */
  create: async (req, res) => {
    try {
      const requestBody = req.body;
      const userToBeCreated = {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        phoneNumber: `${requestBody.phoneNumber}`,
        whatsappNumber: `${requestBody.whatsappNumber || ''}` || null,
        deviceToken: requestBody.deviceToken,
        appVersion: requestBody.appVersion,
        password: requestBody.password,
        designation: requestBody.designation,
        role: requestBody.role,
        status: requestBody.status
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
      const alreadyUser = await UserService.findUserByEmailOrPhone(
        {
          email: userToBeCreated.email,
          phoneNumber: userToBeCreated.phoneNumber
        }
      );
      if (alreadyUser) {
        if (alreadyUser.email === userToBeCreated.email) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.EMAIL_ALREADY_EXISTS);
        }
        if (alreadyUser.phoneNumber === userToBeCreated.phoneNumber) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.PHONE_ALREADY_EXISTS);
        }
      }
      userToBeCreated.role = RolesConstants.EMPLOYEE;
      const password = Crypto.randomBytes(4);
      userToBeCreated.password = await bcrypt.hash(password, 10);
      userToBeCreated.casualLeaves = 0;
      userToBeCreated.bufferLeaves = 0;
      userToBeCreated.unAuthorizedLeaves = 0;
      const createdUser = await UserService.createUser(userToBeCreated);
      const userName = `${userToBeCreated.firstName || ''} ${userToBeCreated.lastName || ''}`.trim();

      (async () => {
        const html = await pug.renderFile(path.join(__dirname, '../../../templates/create-user.pug'), {
          userName,
          password
        });

        Mailer.sendMail({
          to: createdUser.email,
          subject: MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
          html
        });
      })();


      const user = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        password: MessageCodeConstants.PASSWORD_SENT_SUCCESSFULLY,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
        whatsappNumber: createdUser.whatsappNumber,
        designation: createdUser.designation,
        role: createdUser.role,
        status: createdUser.status,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };

      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
        { user },
        StatusCodeConstants.SUCCESS,
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code,
      ));
    }
  },
};
