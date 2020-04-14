const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, sequelize, TeamAssociation } = require('../../../../models');
const OtpService = require('./otp.service');
const { StatusConstants } = require('../../../constants');

const UserService = {

  /**
   * Create new user
   */
  createUser: async (userToBeCreated) => User.create(
    userToBeCreated
  ),

  /**
   * Find user by email or phone
   */
  findUserByEmailOrPhone: async ({ email, phoneNumber }, userId = null) => {
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
   * Count all users
   */
  countUsers: async () => User.count(),

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
    offset, limit, sortBy, sortType
  }) => User.findAndCountAll({
    attributes: { exclude: ['deviceToken', 'appVersion', 'password', 'updatedAt', 'deletedAt'] },
    where: {
      role,
      status: StatusConstants.ACTIVE
    },
    order: [[sortBy, sortType]],
    offset,
    limit,
    includes: TeamAssociation
  }),

  /**
   * Delete User By Id
   */
  deleteUserById: async (id, transaction = null) => User.destroy({
    where: { id }, ...(transaction && { transaction })
  })

};
module.exports = UserService;
