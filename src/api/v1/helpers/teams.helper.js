const { sequelize } = require('../../../../models');
const { TeamsService, TeamAssociationService } = require('../services');

module.exports = {
  createTeamWithSupervisorAssigned: async (teamToBeCreated) => {
    const transaction = await sequelize.transaction();
    try {
      const createdTeam = await TeamsService.createTeam(teamToBeCreated, transaction);
      const teamAssociations = {
        userId: teamToBeCreated.supervisorId,
        isSupervisor: true,
        teamId: createdTeam.id,
        status: createdTeam.status
      };
      await TeamAssociationService.associateATeam(teamAssociations, transaction);
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
