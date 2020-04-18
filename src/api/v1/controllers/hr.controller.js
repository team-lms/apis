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
        search: queryFilters.search || QueryConstants.SEARCH,
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.limit) || QueryConstants.LIMIT,
        sortType: queryFilters.sortType || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortBy || QueryConstants.SORT_BY
      };
      const humanResource = await UserService.getAllUsers({ role: RolesConstants.HR }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.HUMAN_RESOURCE.HUMAN_RESOURCE_FETCHED,
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

  createAHumanResource: async (req, res) => {
    try {
      const result = await UserHelper.createAUser(req);
      if (result && result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(
          Response.sendSuccess(
            MessageCodeConstants.HUMAN_RESOURCE.HUMAN_RESOURCE_CREATED,
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
