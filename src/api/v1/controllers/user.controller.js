const Chalk = require('chalk');
const { Response } = require('../../../utils');
const {
  MessageCodeConstants,
  StatusCodeConstants,
  RolesConstants
} = require('../../../constants');

const { UserHelper } = require('../helpers');

module.exports = {
  /**
   * To create a user.
   */

  // TODO: Something to do here
  createUser: async (req, res) => {
    try {
      const result = await UserHelper.createAUser(req, RolesConstants.EMPLOYEE);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(
          Response.sendSuccess(
            MessageCodeConstants.EMPLOYEE.CREATED,
            result.data,
            StatusCodeConstants.SUCCESS
          )
        );
      }
      return res.status(result.error.responseCode).json(result.error);
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
