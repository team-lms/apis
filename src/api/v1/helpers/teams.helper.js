const { sequelize } = require('../../../../models');
const { TeamsService, UserService } = require('../services');
const { ApiError, Response } = require('../../../utils');
const { MessageCodeConstants, StatusCodeConstants } = require('../../../constants');

module.exports = {
  createTeamWithSupervisorAssigned: async (teamToBeCreated) => {
    const transaction = await sequelize.transaction();
    try {
      const foundUser = await UserService.findUserById({ userId: teamToBeCreated.supervisorId });
      if (!foundUser) {
        throw new ApiError.ValidationError(MessageCodeConstants.USER_NOT_FOUND);
      }
      const createdTeam = await TeamsService.createTeam(teamToBeCreated, transaction);
      await UserService.updateUserById({ teamId: createdTeam.id }, foundUser.id, transaction);
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  updateATeam: async (teamId, foundSupervisor) => {
    const transaction = await sequelize.transaction();
    try {
      const foundPreviousSupervisor = await UserService.findSupervisorOfATeam(teamId, transaction);
      await UserService.updateUserById({ teamId: null }, foundPreviousSupervisor.id, transaction);
      await UserService.updateUserById({ teamId }, foundSupervisor.id, transaction);
      transaction.commit();
      return {
        success: true,
        data: Response.sendSuccess(
          MessageCodeConstants.TEAM.UPDATED,
          {},
          StatusCodeConstants.SUCCESS
        )
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      await transaction.rollback();
      return {
        success: false,
        data: null,
        error: Response.sendSuccess(
          message,
          error,
          code
        )
      };
    }
  }

};
