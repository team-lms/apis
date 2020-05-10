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
const { TeamsHelper } = require('../helpers');

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
        MessageCodeConstants.TEAM.FETCHED,
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
          MessageCodeConstants.TEAM.ALREADY_EXISTS
        );
      }
      if (teamToBeCreated.teamLeader) {
        await TeamsHelper.assignATeamWithTeamLeaderAssigned(teamToBeCreated);
      } else {
        await TeamsService.createTeam(teamToBeCreated);
      }

      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.TEAM.CREATED,
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
  },

  /**
   * Update A team
   */

  updateATeam: async (req, res) => {
    try {
      const reqBody = req.body;
      const { id: teamId } = req.params;
      const teamToBeUpdated = {
        teamName: reqBody.teamName,
        status: reqBody.status,
        teamLeader: reqBody.teamLeader
      };
      const validationResult = Validator.validate(teamToBeUpdated, {
        teamName: { presence: { allowEmpty: false } }
      });

      // validation result
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.ValidationError, validationResult);
      }

      // find team if with same name exists
      const foundTeam = await TeamsService.findTeamByTeamName(teamToBeUpdated.teamName, teamId);
      if (foundTeam) {
        throw new ApiError.ValidationError(MessageCodeConstants.TEAM.ALREADY_EXISTS);
      }
      await TeamsService.updateATeam(teamToBeUpdated, teamId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.TEAM.UPDATED,
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
