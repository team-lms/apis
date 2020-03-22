const Chalk = require('chalk');
const {
  StatusCodeConstants, MessageCodeConstants, RolesConstants, QueryConstants
} = require('../../../constants');
const { Response } = require('../../../utils');
const { UserService } = require('../services');

module.exports = {
  /**
   * Get all Employees
   */
  getAll: async (req, res) => {
    try {
      const reqBody = req.body;
      const filters = {
        search: reqBody.search || QueryConstants.SEARCH,
        offset: Number(reqBody.offset) || QueryConstants.OFFSET,
        limit: Number(reqBody.pageNo) || QueryConstants.LIMIT,
        sortType: reqBody.orderBy || QueryConstants.SORT_TYPE[0],
        sortBy: reqBody.sortType || QueryConstants.SORT_BY
      };

      // const reqBody = req.body;
      const employees = await UserService.getAllUsers({ role: RolesConstants.EMPLOYEE }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.EMPLOYEE_FETCHED,
        employees,
        StatusCodeConstants.SUCCESS
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

};
