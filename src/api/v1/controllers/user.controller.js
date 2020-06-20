const Chalk = require('chalk');
const { Response } = require('../../../utils');
const { StatusCodeConstants } = require('../../../constants');
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
      if (profilePicture) {
        await UserService.updateUserById({ profilePicture }, userId);
      } else {
        throw new Error('There was no profile picture');
      }
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        'User profile updated successfully'
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
