const { sequelize } = require('../../../../models');
const { StatusCodeConstants, RolesConstants } = require('../../../constants');
const UserService = require('./user.service');
/**
 * update Leaves of All Users
 */
const LeaveService = {
  updateLeavesOfAllUsers: async () => {
    const transaction = await sequelize.transaction();
    try {
      await UserService.updateLeaveByRole(
        RolesConstants.ADMIN,
        { casualLeaves: Number(process.env.ADMIN_LEAVE) },
        transaction
      );
      await UserService.updateLeaveByRole(
        RolesConstants.HR,
        { casualLeaves: Number(process.env.HR_LEAVE) },
        transaction
      );
      await UserService.updateLeaveByRole(
        RolesConstants.SUPERVISOR,
        { casualLeaves: Number(process.env.SUPERVISOR_LEAVE) },
        transaction
      );
      await UserService.updateLeaveByRole(
        RolesConstants.EMPLOYEE,
        { casualLeaves: Number(process.env.EMPLOYEE_LEAVE) },
        transaction
      );
      transaction.commit();
      return {
        success: true
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      if (transaction) {
        transaction.rollback();
      }
      return {
        success: false,
        error: {
          message,
          error,
          code
        }
      };
    }
  }
};
module.exports = LeaveService;
