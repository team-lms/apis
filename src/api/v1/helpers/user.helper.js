const bcrypt = require('bcryptjs');
const path = require('path');
const pug = require('pug');
const {
  Validator, ApiError, Response, Crypto, Mailer
} = require('../../../utils');
const {
  MessageCodeConstants,
  RolesConstants,
  StatusCodeConstants,
  ValidationConstant
} = require('../../../constants');

const { UserService, EmployeeService } = require('../services');
const CloudinaryHelper = require('./cloudinary.helper');

const UserHelper = {

  /**
   * Update user
   */
  updateUser: async (req) => {
    try {
      const reqBody = req.body;
      const { id: userId } = req.params;
      const userToBeUpdated = {
        ...(reqBody.firstName && { firstName: reqBody.firstName }),
        ...(reqBody.lastName && { lastName: reqBody.lastName }),
        ...(reqBody.email && { email: reqBody.email }),
        ...(reqBody.phoneNumber && { phoneNumber: reqBody.phoneNumber }),
        ...(reqBody.whatsappNumber && { whatsappNumber: reqBody.whatsappNumber }),
        ...(reqBody.designation && { designation: reqBody.designation }),
        ...(reqBody.role && { role: reqBody.role }),
        ...(reqBody.status && { status: reqBody.status })
      };

      const validationResult = Validator.validate(userToBeUpdated, {
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
        role: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(RolesConstants).map((key) => RolesConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        }
      });

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }

      // check if any other user is present with same email or phone
      const foundUser = await UserService.findUserByEmailOrPhone({
        email: userToBeUpdated.email,
        phoneNumber: userToBeUpdated.phoneNumber
      }, userId);

      if (foundUser) {
        if (foundUser.email === userToBeUpdated.email) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.EMAIL_ALREADY_EXISTS);
        }
        if (foundUser.phoneNumber === userToBeUpdated.phoneNumber) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.PHONE_ALREADY_EXISTS);
        }
      }

      const userName = `${userToBeUpdated.firstName || ''} ${userToBeUpdated.lastName || ''}`.trim();
      if (req.file && req.file.path) {
        const cloudinaryResponse = await CloudinaryHelper.upload({
          filePath: req.file.path,
          tags: [userName]
        });
        userToBeUpdated.profilePicture = cloudinaryResponse.secure_url;
      }

      await UserService.updateUserById(userToBeUpdated, userId);
      return {
        success: true,
        error: null
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return {
        success: false,
        error: Response.sendError(
          message,
          error,
          code
        )
      };
    }
  },

  /**
   * Create A User
   */

  createAUser: async (req) => {
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

        return {
          success: true,
          data: result.data
        };
      }
      return {
        success: false,
        data: result.data
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return {
        success: false,
        error: Response.sendError(
          message,
          error
        )
      };
    }
  }

};


module.exports = UserHelper;
