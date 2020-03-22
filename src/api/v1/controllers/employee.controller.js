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
  getAllEmployees: async (req, res) => {
    try {
      const queryFilters = req.queryParams;
      const filters = {
        search: queryFilters.search || QueryConstants.SEARCH,
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.pageNo) || QueryConstants.LIMIT,
        sortType: queryFilters.orderBy || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortType || QueryConstants.SORT_BY
      };

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
