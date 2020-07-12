const { Op } = require('sequelize');
const { Team, User } = require('../../../../models');

module.exports = {

  /**
   * Get team by team id
   */
  getTeamById: async (teamId) => Team.findOne({ where: { id: teamId } }),

  /**
   * Get the teams
   */
  getAllTeams: async ({
    offset, limit, sortBy, sortType
  }) => Team.findAndCountAll({
    order: [[sortBy, sortType]],
    offset,
    limit,
    attributes: { exclude: ['updatedAt', 'deletedAt'] },
    include: [{
      model: User,
      as: 'users',
      through: { attributes: [] },
      attributes: ['id', 'firstName', 'middleName', 'lastName', 'email', 'phoneNumber', 'role']
    }]
  }),

  /**
   * Get team by team name
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
   * Create a new team
   */
  createTeam: async (teamToBeCreated, transaction = null) => Team.create(teamToBeCreated, {
    ...(transaction && { transaction })
  }),

  /**
   * Update a team by id
   */
  updateATeam: async (teamToBeUpdated, id, transaction) => Team.update(
    teamToBeUpdated,
    {
      where: { id },
      ...(transaction && { transaction })
    }
  ),

  /**
   * Delete a team by id
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
