const {
  StatusCodeConstants,
  QueryConstants,
  RolesConstants,
  MessageCodeConstants
} = require('../../../constants');
const {
  Response
} = require('../../../utils');
const { UserService } = require('../services');

module.exports = {
  getAllHumanResources: async (req, res) => {
    try {
      const queryFilters = req.params;
      const filters = {
        search: (queryFilters.search) || QueryConstants.SEARCH,
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
  }
};
