const { Op } = require('sequelize');
const { TeamAssociation, Team, sequelize } = require('../../../../models');
const UserService = require('./user.service');

const TeamAssociationsService = {
  /**
   * Associate A Team
   */
  associateATeam: async (teamToBeAssociated, transaction = null) => TeamAssociation.create(
    teamToBeAssociated,
    { ...(transaction && { transaction }) }
  ),

  updateAssociatingATeam: async (teamToBeAssociated, id,
    transaction = null) => TeamAssociation.update(
    teamToBeAssociated, {
      where: {
        id,
        ...(transaction && { transaction })
      }
    }
  ),

  /**
   * find Team of a User
   */

  findTeamOfAUser: ({ userId }, transaction = null) => TeamAssociation.findOne({
    where: { userId },
    attributes: { exclude: ['deletedAt', 'updatedAt'] },
    include: [{
      model: Team,
      as: 'team',
      attributes: { exclude: ['deletedAt'] }
    }],
    ...(transaction && { transaction })

  }),

  /**
   * findSupervisorOfATeam
   */
  findSupervisorOfATeam: async ({ teamId }) => {
    const transaction = await sequelize.transaction();
    try {
      const teamSupervisor = await TeamAssociation.findOne({
        where: {
          [Op.and]: [{ teamId }, { isSupervisor: true }]
        }
      });
      const foundSupervisor = await UserService.findUserById({ userId: teamSupervisor.userId });
      transaction.commit();
      return {
        success: true,
        data: foundSupervisor
      };
    } catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      return {
        success: false,
        data: {}
      };
    }
  }
};
module.exports = TeamAssociationsService;
