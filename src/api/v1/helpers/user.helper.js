const bcrypt = require('bcryptjs');
const path = require('path');
const pug = require('pug');
const {
  ApiError,
  Crypto,
  Mailer,
  Response,
  Validator
} = require('../../../utils');
const {
  MessageCodeConstants,
  RolesConstants,
  StatusCodeConstants,
  ValidationConstant,
  SexConstants,
  MaritalStatusConstants
} = require('../../../constants');

const { UserService, TeamsService } = require('../services');

const UserHelper = {

  /**
   * Create a new user
   */
  createUser: async (req) => {
    try {
      const reqBody = req.body;
      const userToBeCreated = {
        firstName: reqBody.firstName,
        middleName: reqBody.middleName,
        lastName: reqBody.lastName,
        email: reqBody.email,
        phoneNumber: `${reqBody.phoneNumber || ''}` || null,
        whatsappNumber: `${reqBody.whatsappNumber || ''}` || null,
        dateOfBirth: reqBody.dateOfBirth,
        address: reqBody.address,
        pinCode: reqBody.pinCode,
        sex: reqBody.sex,
        maritalStatus: reqBody.maritalStatus,
        nationality: reqBody.nationality,
        hiredOn: reqBody.hiredOn,
        deviceToken: reqBody.deviceToken,
        teamId: reqBody.teamId || null,
        appVersion: reqBody.appVersion,
        password: reqBody.password,
        designation: reqBody.designation,
        role: reqBody.role,
        status: reqBody.status,
        jobType: reqBody.jobType
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
        teamId: { numericality: { onlyInteger: true } },
        dateOfBirth: { presence: { allowEmpty: false } },
        address: { presence: { allowEmpty: false } },
        pinCode: { presence: { allowEmpty: false } },
        sex: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(SexConstants).map((key) => SexConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        },
        maritalStatus: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(MaritalStatusConstants).map((key) => MaritalStatusConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        },
        nationality: { presence: { allowEmpty: false } },
        hiredOn: { presence: { allowEmpty: false } },
        jobType: { presence: { allowEmpty: false } }
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
      if (userToBeCreated.teamId) {
        const foundTeam = await TeamsService.getTeamById(userToBeCreated.teamId);
        if (!foundTeam) {
          throw new ApiError.ValidationError((MessageCodeConstants.VALIDATION_ERROR, 'Team not found'));
        }
      }
      const userName = `${userToBeCreated.firstName || ''} ${userToBeCreated.middleName || ''} ${userToBeCreated.lastName || ''}`.trim();
      const count = await UserService.countUsers();
      const empIdLength = Number(process.env.EMPLOYEE_ID_LENGTH);
      const employeeId = `${process.env.EMPLOYEE_ID_PREFIX}${('0'.repeat(empIdLength) + (count + 1)).substr(-empIdLength)}`;
      userToBeCreated.employeeId = employeeId;

      const password = Crypto.randomBytes(4);
      userToBeCreated.password = await bcrypt.hash(password, 10);

      const createdUser = await UserService.createUser(userToBeCreated);
      const user = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
        whatsappNumber: createdUser.whatsappNumber,
        designation: createdUser.designation,
        role: createdUser.role,
        status: createdUser.status,
        employeeId: createdUser.employeeId,
        profilePicture: createdUser.profilePicture,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt
      };
      (async () => {
        const html = await pug.renderFile(
          path.join(__dirname, '../../../templates/create-user.pug'),
          { userName, password }
        );

        Mailer.sendMail({
          to: createdUser.email,
          subject: MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
          html
        });
      })();

      return {
        success: true,
        data: Response.sendSuccess('User has been created successfully', user)
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
   * Update user
   */
  updateUser: async (req) => {
    try {
      const reqBody = req.body;
      const { id: userId } = req.params;
      const userToBeUpdated = {
        ...(reqBody.firstName && { firstName: reqBody.firstName }),
        ...(reqBody.middleName && { middleName: reqBody.middleName }),
        ...(reqBody.lastName && { lastName: reqBody.lastName }),
        ...(reqBody.email && { email: reqBody.email }),
        ...(reqBody.phoneNumber && { phoneNumber: reqBody.phoneNumber }),
        ...(reqBody.whatsappNumber && { whatsappNumber: reqBody.whatsappNumber }),
        ...(reqBody.dateOfBirth && { dateOfBirth: reqBody.dateOfBirth }),
        ...(reqBody.address && { address: reqBody.address }),
        ...(reqBody.pinCode && { pinCode: reqBody.pinCode }),
        ...(reqBody.sex && { sex: reqBody.sex }),
        ...(reqBody.maritalStatus && { maritalStatus: reqBody.maritalStatus }),
        ...(reqBody.nationality && { nationality: reqBody.nationality }),
        ...(reqBody.hiredOn && { hiredOn: reqBody.hiredOn }),
        ...(reqBody.teamId && { teamId: reqBody.teamId }),
        ...(reqBody.designation && { designation: reqBody.designation }),
        ...(reqBody.role && { role: reqBody.role }),
        ...(reqBody.status && { status: reqBody.status }),
        ...(reqBody.jobType && { jobType: reqBody.jobType })
      };

      const validationResult = Validator.validate(userToBeUpdated, {
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
        teamId: { numericality: { onlyInteger: true } },
        dateOfBirth: { presence: { allowEmpty: false } },
        address: { presence: { allowEmpty: false } },
        pinCode: { presence: { allowEmpty: false } },
        sex: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(SexConstants).map((key) => SexConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        },
        maritalStatus: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(MaritalStatusConstants).map((key) => MaritalStatusConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        },
        nationality: { presence: { allowEmpty: false } },
        hiredOn: { presence: { allowEmpty: false } },
        jobType: { presence: { allowEmpty: false } }
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
  }

};
module.exports = UserHelper;
