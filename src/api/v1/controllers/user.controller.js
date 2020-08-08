const Chalk = require('chalk');
const { Response, ApiError } = require('../../../utils');
const { StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
const { CloudinaryHelper } = require('../helpers');
const { UserService } = require('../services');

module.exports = {

  /**
   * Update the profile picture of the user
   */
  updateProfilePicture: async (req, res) => {
    try {
      const { id: userId } = req.params;
      let profilePicture = null;
      if (req.file && req.file.path) {
        ({ secure_url: profilePicture } = await CloudinaryHelper.upload({
          filePath: req.file.path
        }));
      }
      if (!profilePicture) {
        throw new ApiError.InternalServerError();
      }
      await UserService.updateUserById({ profilePicture }, userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.USER_PROFILE_IMAGE_UPDATED
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },

  /**
   * Get Profile By Token
   */
  getProfile: async (req, res) => {
    try {
      const { id: userId } = req.userInfo;
      const foundUser = await UserService.findUserById({ userId });
      if (!foundUser) {
        throw new ApiError.ValidationError(
          MessageCodeConstants.USER_NOT_FOUND
        );
      }
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.USER_PROFILE_FETCHED,
        foundUser
      ));
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
