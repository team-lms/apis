const { sequelize } = require('../../../../models');
const { TeamsService, TeamAssociationService } = require('../services');

module.exports = {
  assignATeamWithTeamLeaderAssigned: async (teamToBeCreated) => {
    const transaction = await sequelize.transaction();
    try {
      const createdTeam = await TeamsService.createTeam(teamToBeCreated, transaction);
      const teamAssociations = {
        userId: teamToBeCreated.teamLeader.id,
        isSupervisor: 1,
        teamId: createdTeam.id,
        status: teamToBeCreated.teamLeader.status
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
