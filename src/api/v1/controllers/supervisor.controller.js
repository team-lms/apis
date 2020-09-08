const {
  StatusCodeConstants,
  QueryConstants,
  RolesConstants,
  MessageCodeConstants
} = require('../../../constants');
const { Response } = require('../../../utils');
const { UserService } = require('../services');
const { UserHelper } = require('../helpers');

module.exports = {
  /**
   * Get Supervisor List
   */
  getAllSuperVisors: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        searchTerm: queryFilters.searchTerm || QueryConstants.SEARCH_TERM,
        searchBy: queryFilters.searchBy || QueryConstants.USER_SEARCH_BY[0],
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.limit) || QueryConstants.LIMIT,
        sortType: queryFilters.sortType || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortBy || QueryConstants.USER_SORT_BY[0]
      };

      const supervisors = await UserService.getAllUsers({
        role: RolesConstants.SUPERVISOR
      }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.SUPERVISOR.FETCHED,
        supervisors,
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },
  /**
 * Update Supervisor By Id
 * */
  updateSupervisorById: async (req, res) => {
    try {
      const result = await UserHelper.updateUser(req);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.SUPERVISOR.UPDATED,
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
   * Delete Supervisor by Id
   */

  deleteSupervisorById: async (req, res) => {
    try {
      const { id: userId } = req.params;
      const deletedSupervisor = await UserService.deleteUserById(userId);
      if (deletedSupervisor) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.SUPERVISOR.DELETED,
          {},
          StatusCodeConstants.SUCCESS
        ));
      } return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.SUPERVISOR.ALREADY_DELETED,
        {},
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.send(code).json(Response.sendError(
        message,
        code,
        error
      ));
    }
  },

  /**
   * Create a Supervisor
   */
  createASupervisor: async (req, res) => {
    try {
      req.body.role = RolesConstants.SUPERVISOR;
      const result = await UserHelper.createUser(req);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(
          Response.sendSuccess(
            MessageCodeConstants.SUPERVISOR.CREATED,
            result.data,
            StatusCodeConstants.SUCCESS
          )
        );
      }
      return res.status(result.error.responseCode).json(result.error);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }
};
