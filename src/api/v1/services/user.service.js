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
      attributes: { exclude: ['deletNOT_FOUND: 404,edAt'] },
    });
  },
};
module.exports = {
  UserService,
};
