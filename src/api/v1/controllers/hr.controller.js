const { Response } = require('../../../utils');
const { UserService } = require('../services');
const { UserHelper } = require('../helpers');
const {
  MessageCodeConstants,
  QueryConstants,
  RolesConstants,
  StatusCodeConstants
} = require('../../../constants');

module.exports = {

  /**
   * Get all HR managers
   */
  getAllHumanResources: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        searchTerm: queryFilters.searchTerm || QueryConstants.SEARCH_TERM,
        searchBy: queryFilters.searchBy || QueryConstants.SEARCH_BY,
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.limit) || QueryConstants.LIMIT,
        sortType: queryFilters.sortType || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortBy || QueryConstants.SORT_BY
      };
      const humanResource = await UserService.getAllUsers({ role: RolesConstants.HR }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.HUMAN_RESOURCE.FETCHED,
        humanResource,
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
   * Create A HR
   */

  createNewHumanResource: async (req, res) => {
    try {
      const result = await UserHelper.createAUser(req, RolesConstants.HR);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(
          Response.sendSuccess(
            MessageCodeConstants.HUMAN_RESOURCE.CREATED,
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
  },

  /**
   * Update A HR
   */

  updateAHumanResourceById: async (req, res) => {
    try {
      const result = await UserHelper.updateUser(req);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.HUMAN_RESOURCE.UPDATED,
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
   * Delete A HR by Id
   */
  deleteHumanResourceById: async (req, res) => {
    try {
      const { id: userId } = req.params;
      await UserService.deleteUserById(userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.HUMAN_RESOURCE.DELETED,
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
