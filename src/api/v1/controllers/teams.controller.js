const {
  StatusCodeConstants,
  QueryConstants,
  MessageCodeConstants
} = require('../../../constants');
const {
  Response,
  Validator,
  ApiError
} = require('../../../utils');
const { TeamsService } = require('../services');

module.exports = {
  /**
   * Get Teams List
   */
  getAllTeams: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        search: (queryFilters.search) || (QueryConstants.SEARCH),
        offset: Number(queryFilters.offset) || (QueryConstants.OFFSET),
        limit: Number(queryFilters.limit) || (QueryConstants.LIMIT),
        sortType: (queryFilters.sortType) || (QueryConstants.SORT_TYPE[0]),
        sortBy: (queryFilters.sortField) || (QueryConstants.SORT_BY_TEAM_NAME)
      };
      const teams = await TeamsService.getAllTeams(filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.TEAM.TEAMS_FETCHED,
        teams,
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
   * Create A Team
   */

  createTeam: async (req, res) => {
    try {
      const reqBody = req.body;
      const teamToBeCreated = {
        teamName: reqBody.teamName,
        status: reqBody.status,
        teamLeader: reqBody.teamLeader
      };
      const validationResult = Validator.validate(teamToBeCreated, {
        teamName: { presence: { allowEmpty: false } }
      });
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.ValidationError, validationResult);
      }
      const foundTeam = await TeamsService.findTeamByTeamName(teamToBeCreated.teamName);

      if (foundTeam) {
        throw new ApiError.ResourceAlreadyExistError(
          MessageCodeConstants.TEAM.TEAM_ALREADY_EXISTS

        );
      }

      if (teamToBeCreated.teamLeader) {
        const teamAssociation = {
          userId: teamToBeCreated.teamLeader.id,
          isSupervisor: 1,
          status: teamToBeCreated.teamLeader.status
        };
        await TeamsService.createATeamWithTeamLeaderAssigned(teamToBeCreated, teamAssociation);
      } else {
        await TeamsService.createTeam(teamToBeCreated);
      }

      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.TEAM.TEAM_CREATED_SUCCESSFULLY,
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
