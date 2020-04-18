const bcrypt = require('bcryptjs');
const Chalk = require('chalk');
const path = require('path');
const pug = require('pug');
const { UserService, EmployeeService } = require('../services');
const {
  ApiError,
  Crypto,
  Mailer,
  Response,
  Validator
} = require('../../../utils');
const {
  MessageCodeConstants,
  StatusCodeConstants,
  ValidationConstant,
  RolesConstants
} = require('../../../constants');

const { CloudinaryHelper } = require('../helpers');

module.exports = {
  /**
   * To create a user.
   */
  createUser: async (req, res) => {
    try {
      const requestBody = req.body;
      const userToBeCreated = {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        team: requestBody.team,
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
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH }
        },
        whatsappNumber: {
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.WHATS_APP_NUMBER_LENGTH }
        },
        designation: { presence: { allowEmpty: false } },
        role: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(RolesConstants).map((key) => RolesConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        },
        team: { presence: { allowEmpty: false } }
      });
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      // check if a user is present with same email or phone
      const alreadyUser = await UserService.findUserByEmailOrPhone({
        email: userToBeCreated.email,
        phoneNumber: userToBeCreated.phoneNumber
      });

      if (alreadyUser) {
        if (alreadyUser.email === userToBeCreated.email) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.EMAIL_ALREADY_EXISTS);
        }
        if (alreadyUser.phoneNumber === userToBeCreated.phoneNumber) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.PHONE_ALREADY_EXISTS);
        }
      }

      const userName = `${userToBeCreated.firstName || ''} ${userToBeCreated.lastName || ''}`.trim();
      if (req.file && req.file.path) {
        const cloudinaryResponse = await CloudinaryHelper.upload({
          filePath: req.file.path,
          tags: [userName]
        });
        userToBeCreated.profilePicture = cloudinaryResponse.secure_url;
      }

      const count = await UserService.countUsers();
      const empIdLength = Number(process.env.EMPLOYEE_ID_LENGTH);
      const employeeId = `${process.env.EMPLOYEE_ID_PREFIX}${('0'.repeat(empIdLength) + (count + 1)).substr(-empIdLength)}`;
      userToBeCreated.employeeId = employeeId;

      const password = Crypto.randomBytes(4);
      userToBeCreated.password = await bcrypt.hash(password, 10);
      const result = await EmployeeService.createANewEmployee(userToBeCreated);
      if (result && result.success) {
        (async () => {
          const html = await pug.renderFile(
            path.join(__dirname, '../../../templates/create-user.pug'),
            { userName, password }
          );

          Mailer.sendMail({
            to: result.data.data.user.email,
            subject: MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
            html
          });
        })();
        return res.status(result.data.responseCode).json(result.data);
      }
      return res.status(result.error.code).json(result.error);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }


};
