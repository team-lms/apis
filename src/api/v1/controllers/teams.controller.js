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
const { TeamsService, UserService } = require('../services');
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
        supervisorId: reqBody.supervisor
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
      const createdTeam = teamToBeCreated.supervisorId
        ? await TeamsHelper.createTeamWithSupervisorAssigned(teamToBeCreated)
        : await TeamsService.createTeam(teamToBeCreated);

      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.TEAM.CREATED,
        createdTeam,
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
        supervisor: reqBody.supervisor
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
      const foundSupervisor = await UserService.findUserById(
        { userId: teamToBeUpdated.supervisor }
      );
      if (!foundSupervisor) {
        throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
      }

      const result = await TeamsHelper.updateATeam(teamId, foundSupervisor);
      if (result && result.success) {
        return res.status(result.data.responseCode).json(
          Response.sendSuccess(
            MessageCodeConstants.TEAM.UPDATED,
            {},
            result.data.responseCode
          )
        );
      }
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
  },

  /**
 * Delete A Team
 */

  deleteATeam: async (req, res) => {
    try {
      const { id: teamId } = req.params;
      const deletedTeam = await TeamsService.deleteATeam(teamId);
      if (deletedTeam) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.TEAM.DELETED,
          {},
          StatusCodeConstants.SUCCESS
        ));
      }
      return res.status(StatusCodeConstants.INTERNAL_SERVER_ERROR).json(Response.sendError(
        MessageCodeConstants.TEAM.ALREADY_DELETED,
        {},
        StatusCodeConstants.INTERNAL_SERVER_ERROR
      ));
    } catch ({ message, code, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }

};
