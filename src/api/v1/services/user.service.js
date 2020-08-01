const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const {
  User,
  sequelize,
  Team
} = require('../../../../models');
const OtpService = require('./otp.service');
const { StatusConstants, RolesConstants, QueryConstants } = require('../../../constants');

const UserService = {

  /**
   * Create new user
   */
  createUser: async (userToBeCreated, transaction = null) => User.create(
    userToBeCreated,
    { ...(transaction && { transaction }) }
  ),

  /**
   * Find user by email or phone
   */
  findUserByEmailOrPhone: async ({ email = null, phoneNumber = null }, userId = null) => {
    if (!email && !phoneNumber) {
      return null;
    }
    return User.findOne({
      where: {
        [Op.or]: [
          { ...(email && { email }) },
          { ...(phoneNumber && { phoneNumber }) }
        ],
        ...(userId && { id: { [Op.ne]: userId } })
      },
      paranoid: false,
      attributes: { exclude: ['deletedAt'] }
    });
  },

  /**
   * find User By id
   */
  findUserById: async ({ userId }) => User.findOne({
    where: {
      id: userId
    },
    paranoid: false,
    attributes: { exclude: ['deletedAt'] }
  }),

  /**
   * Count all users
   */
  countUsers: async () => User.count(
    { paranoid: false }
  ),

  /**
   * Update user by user id
   */
  updateUserById: async (updatedUser, id, transaction = null) => User.update(
    updatedUser,
    { where: { id }, ...(transaction && { transaction }) }
  ),

  /**
   * Reset user password
   */
  resetPassword: async (password, id, foundOtp) => {
    const transaction = await sequelize.transaction();
    try {
      await UserService.updateUserById(
        { password: await bcrypt.hash(password, 10) },
        id,
        transaction
      );
      await OtpService.updateOtpById(
        foundOtp.id,
        { status: StatusConstants.INACTIVE },
        transaction
      );
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  /**
   * Get All Users based on their Roles
   */
  getAllUsers: async ({ role }, {
    offset,
    limit,
    sortBy,
    sortType,
    searchBy,
    searchTerm
  }, additionalFilters = null) => {
    let searchCriteria = {};
    if (searchBy.toLowerCase() === 'name' && searchTerm) {
      searchCriteria = Sequelize.where(
        Sequelize.fn('concat', Sequelize.fn('trim', Sequelize.col('firstName')), ' ', Sequelize.fn('trim', Sequelize.col('lastName'))),
        { [Op.substring]: searchTerm }
      );
    } else {
      searchCriteria = {
        ...((searchBy && searchTerm) && {
          [searchBy]: {
            [Op.substring]: searchTerm
          }
        })
      };
    }

    let orderBy = null;
    if (QueryConstants.USER_SORT_BY.indexOf(sortBy) > -1) {
      orderBy = {
        order: sortBy === 'name'
          ? Sequelize.literal(`Concat(Trim(\`User\`.\`firstName\`), ' ',Trim(\`User\`.\`middleName\`), ' ',  Trim(\`User\`.\`lastName\`)) ${sortType}`)
          : [
            [sortBy, sortType]
          ]
      };
    }

    if (!orderBy && QueryConstants.TEAM_SORT_BY.indexOf(sortBy) > -1) {
      orderBy = {
        order: [
          [{ model: Team, as: 'team' }, sortBy, sortType]
        ]
      };
    }

    if (!orderBy && QueryConstants.SUPERVISOR_SORT_BY.indexOf(sortBy) > -1) {
      orderBy = {
        order: [
          [{ model: Team, as: 'team' }, { model: User, as: 'users' }, 'firstName', sortType]
        ]
      };
    }

    return User.findAndCountAll({
      attributes: { exclude: ['deviceToken', 'appVersion', 'password', 'updatedAt', 'deletedAt'] },
      where: {
        [Op.and]: [
          { role, status: StatusConstants.ACTIVE },
          searchCriteria
        ]
      },
      ...(!!orderBy && orderBy),
      offset,
      limit,
      include: [{
        model: Team,
        as: 'team',
        attributes: { exclude: ['updatedAt', 'deletedAt'] },
        include: [{
          model: User,
          as: 'users',
          ...(additionalFilters && { where: { role: additionalFilters } }),
          required: false
        }]
      }],
      distinct: true
    });
  },

  /**
   * Delete User By Id
   */
  deleteUserById: async (id, transaction = null) => User.destroy({
    where: {
      [Op.and]: [
        { id },
        { deletedAt: { [Op.eq]: null } }
      ]
    },
    ...(transaction && { transaction })
  }),

  /**
   * Update Leave By Role
   */

  updateLeaveByRole: async (role, casualLeaves, transaction = null) => User.update(
    { casualLeaves: sequelize.literal('casualLeaves + 1') },
    { where: { role }, ...(transaction && { transaction }) }
  ),
  /**
   * Get All Users based on their roles with no filters
   */

  getAllUsersOfARole: async (role) => User.findAll({
    where: { role }
  }),
  /**
* Find Supervisor of a Team
*/

  findSupervisorOfATeam: async (teamId, transaction = null) => User.findOne({
    where: {
      [Op.and]: [
        { teamId },
        { role: RolesConstants.SUPERVISOR }
      ]
    },
    ...(transaction && { transaction }),
    paranoid: false,
    attributes: { exclude: ['deletedAt'] }
  })

};
module.exports = UserService;
