const { Team, sequelize } = require('../../../../models');
const TeamAssociationsService = require('./teamAssociations');


const TeamsService = {

  /**
   * Get Team List
   */
  getAllTeams: async ({
    offset, limit, sortBy, sortType
  }) => Team.findAndCountAll({
    order: [[sortBy, sortType]],
    offset,
    limit,
    paranoid: false
  }),


  /**
   * Find Team by Team Name
   */
  findTeamByTeamName: async (teamName) => {
    if (!teamName) {
      return null;
    }
    return Team.findOne({
      where: { teamName },
      paranoid: false
    });
  },

  createATeamWithTeamLeaderAssigned: async (teamToBeCreated, teamAssociations) => {
    const transaction = await sequelize.transaction();
    try {
      await TeamsService.createTeam(teamToBeCreated, transaction);
      await TeamAssociationsService.associateATeam(teamAssociations, transaction);
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  /**
   * Create a Team
   */

  createTeam: async (teamToBeCreated, transaction = null) => Team.create(teamToBeCreated, {
    ...(transaction && { transaction })
  })

};

module.exports = TeamsService;
