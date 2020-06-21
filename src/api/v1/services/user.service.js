const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const {
  User,
  sequelize,
  Team,
  TeamAssociation
} = require('../../../../models');
const OtpService = require('./otp.service');
const { StatusConstants, RolesConstants } = require('../../../constants');

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
  }) => {
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

    const sortByTerm = sortBy === 'name'
      ? Sequelize.fn('concat', Sequelize.fn('trim', Sequelize.col('firstName')), ' ', Sequelize.fn('trim', Sequelize.col('lastName')))
      : sortBy;

    return User.findAndCountAll({
      attributes: { exclude: ['deviceToken', 'appVersion', 'password', 'updatedAt', 'deletedAt'] },
      where: {
        [Op.and]: [
          { role, status: StatusConstants.ACTIVE },
          searchCriteria
        ]
      },
      order: [[sortByTerm, sortType]],
      offset,
      limit,
      include: [{
        model: TeamAssociation,
        as: 'teamAssociation',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'UserId'] },
        include: [{
          model: Team,
          as: 'team',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          required: false,
          include: [{
            model: User,
            as: 'users',
            through: { attributes: [] },
            where: { role: RolesConstants.SUPERVISOR },
            attributes: ['id', 'firstName', 'middleName', 'lastName', 'email', 'phoneNumber', 'role', 'designation'],
            required: false
          }]
        }]
      }]
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
  })

};
module.exports = UserService;
