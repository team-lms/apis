const Chalk = require('chalk');
const { UserHelper } = require('../helpers');
const { StatusCodeConstants } = require('../../../constants');
const { Response } = require('../../../utils');

module.exports = {
  register: async (req, res) => {
    try {
      const requestBody = req.body;
      const result = await UserHelper.createNewUser(requestBody);
      if (result && result.success) {
        return res.status(result.data.responseCode).json(result.data);
      }
      return res.status(result.error.responseCode).json(result.error);
    } catch ({ message, code, error = StatusCodeConstants.INTERNAL_SERVER_ERROR }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code,
      ));
    }
  },
};
