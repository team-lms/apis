const { Op } = require('sequelize');
const { Team, TeamAssociation } = require('../../../../models');
const { StatusConstants } = require('../../../constants');

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
    include: [
      {
        model: TeamAssociation,
        as: 'teamAssociations',
        attributes: { exclude: ['updatedAt', 'deletedAt'] }
      }],
    distinct: true
  }),


  /**
   * Find Team by Team Name
   */
  findTeamByTeamName: async (teamName, teamId = null) => {
    if (!teamName) {
      return null;
    }
    return Team.findOne({
      where: {
        teamName,
        ...(teamId && { id: { [Op.ne]: teamId } })
      },
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
  ),

  /**
   * Delete A Team
   */
  deleteATeam: async (id, transaction = null) => Team.destroy({
    where: {
      [Op.and]: [
        { id },
        { deletedAt: { [Op.eq]: null } }
      ]
    },
    ...(transaction && { transaction })
  })

};

module.exports = TeamsService;
