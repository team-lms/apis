const { Team, TeamAssociation } = require('../../../../models');
// const TeamAssociationsService = require('./teamAssociations');

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
    include: [{ model: TeamAssociation, as: 'teamAssociations' }]

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
      paranoid: true
    });
  },

  /**
   * Create a Team
   */

  createTeam: async (teamToBeCreated, transaction = null) => Team.create(teamToBeCreated, {
    ...(transaction && { transaction })
  }),

  /**
   * Update A Team
   */

  updateATeam: async (teamToBeUpdated, id, transaction) => Team.update(
    teamToBeUpdated,
    {
      where: { id },
      ...(transaction && { transaction })
    }
  )

};

module.exports = TeamsService;
