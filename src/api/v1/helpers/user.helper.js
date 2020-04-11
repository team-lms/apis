const { Validator, ApiError, Response } = require('../../../utils');
const {
  MessageCodeConstants,
  RolesConstants,
  StatusCodeConstants,
  ValidationConstant
} = require('../../../constants');
const UserService = require('../services/user.service');
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
  }
};


module.exports = UserHelper;
