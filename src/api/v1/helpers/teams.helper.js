const { sequelize } = require('../../../../models');
const { TeamsService, TeamAssociationService, UserService } = require('../services');
const { ApiError } = require('../../../utils');
const { MessageCodeConstants } = require('../../../constants');

module.exports = {
  createTeamWithSupervisorAssigned: async (teamToBeCreated) => {
    const transaction = await sequelize.transaction();
    try {
      // const { supervisorId : parseInt(userId) } = teamToBeCreated;
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

  updateATeam: async (teamToBeUpdated, teamAssociationToBeUpdated) => {
    const transaction = await sequelize.transaction();
    try {
      await TeamsService.updateATeam(teamToBeUpdated, teamToBeUpdated.id, transaction);
      await TeamAssociationService.updateATeam(teamAssociationToBeUpdated,
        teamAssociationToBeUpdated.id, transaction);
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }

};
