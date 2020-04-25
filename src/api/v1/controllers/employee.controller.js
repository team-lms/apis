const Chalk = require('chalk');
const {
  StatusCodeConstants,
  MessageCodeConstants,
  RolesConstants,
  QueryConstants
} = require('../../../constants');
const { Response } = require('../../../utils');
const { UserService } = require('../services');
const { UserHelper } = require('../helpers');

module.exports = {
  /**
   * Get all Employees
   */
  getAllEmployees: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        searchTerm: queryFilters.searchTerm || QueryConstants.SEARCH_TERM,
        searchBy: queryFilters.searchBy || QueryConstants.SEARCH_BY,
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.pageNo) || QueryConstants.LIMIT,
        sortType: queryFilters.sortType || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortBy || QueryConstants.SORT_BY
      };

      const employees = await UserService.getAllUsers({ role: RolesConstants.EMPLOYEE }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.EMPLOYEE.FETCHED,
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

  /**
   * Update the employee By Id
   */
  updateEmployee: async (req, res) => {
    try {
      const result = await UserHelper.updateUser(req);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.EMPLOYEE.UPDATED,
          {},
          StatusCodeConstants.SUCCESS
        ));
      }
      return res.status(result.error.responseCode).json(result.error);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },

  /**
   * Delete Employee By Id
   */
  deleteEmployee: async (req, res) => {
    try {
      const { id: userId } = req.params;
      await UserService.deleteUserById(userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.EMPLOYEE.DELETED,
        {},
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }

};
