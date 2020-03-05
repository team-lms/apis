const Validator  = require('../../../utils');
const  User  = require('../../../../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const UserService = {
  findUserByEmailOrPhone = async ({ email, phoneNumber }, userId = null) => {
    if (!email && !phone) {
      return null;
    }
    return User.findOne({
      where: {
        [Op.or]: [
          { ...(email && { email }) },
          { ... (phoneNumber && { password }) }
        ],
        ...(userId && {
          id: {
            [Op.ne]: userId
          }
        })
      },
      paranoid: false,
      attributes: {exclude: ['deletedAt']}
    });
  },
}
module.exports = {
  UserService

}
