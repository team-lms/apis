const { Op } = require('sequelize');
const { Team, User, Sequelize } = require('../../../../models');
const { QueryConstants } = require('../../../constants');

module.exports = {

  /**
     * Get team by team id
     */
  getTeamById: async (teamId) => Team.findOne({ id: teamId }),

  /**
     * Get the teams
     */
  getAllTeams: async ({
    offset,
    limit,
    sortBy,
    sortType
  }) => {
    let orderBy = null;
    if (QueryConstants.TEAM_SORT_BY.indexOf(sortBy) > -1) {
      orderBy = {
        order: [
          [sortBy, sortType]
        ]
      };
    }
    if (!orderBy && QueryConstants.USER_SORT_BY.indexOf(sortBy) > -1) {
      orderBy = {
        order:
          Sequelize.literal(`Concat(Trim(\`users\`.\`firstName\`), ' ',Trim(\`User\`.\`middleName\`), ' ',  Trim(\`User\`.\`lastName\`)) ${sortType}`)
      };
    }

    return Team.findAndCountAll({
      order: [
        [sortBy, sortType]
      ],
      offset,
      limit,
      ...(orderBy && orderBy),
      attributes: { exclude: ['updatedAt', 'deletedAt'] },
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'middleName', 'lastName', 'email', 'phoneNumber', 'role']
      }],
      distinct: true
    });
  },

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
        ...(teamId && {
          id: { [Op.ne]: teamId }
        })
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
    teamToBeUpdated, {
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
        {
          deletedAt: { [Op.eq]: null }
        }
      ]
    },
    ...(transaction && { transaction })
  })

};
