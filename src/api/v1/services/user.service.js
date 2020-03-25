const Sequelize = require('sequelize');
const { User } = require('../../../../models');

const { Op } = Sequelize;

const UserService = {

  createUser: async (userToBeCreated) => User.create(
    userToBeCreated,
  ),
  findUserByEmailOrPhone: async ({ email, phoneNumber }, userId = null) => {
    if (!email && !phoneNumber) {
      return null;
    }
    return User.findOne({
      where: {
        [Op.or]: [
          { ...(email && { email }) },
          { ...(phoneNumber && { phoneNumber }) },
        ],
        ...(userId && {
          id: {
            [Op.ne]: userId,
          },
        }),
      },
      paranoid: false,
      attributes: { exclude: ['deletedAt'] },
    });
  },

  updateUser: async (updatedUser, id) => User.update(updatedUser,
    { where: { id } }),

  getAllUsers: async ({ role }, {
    search, offset, limit, sortBy, sortType
  }) => User.findAndCountAll({
    attributes: { exclude: ['deviceToken', 'appVersion', 'password', 'createdAt', 'updatedAt', 'deletedAt'] },
    where: { role },
    order: [[sortBy, sortType]],
    offset,
    limit
  })

};
module.exports = {
  UserService,
};
