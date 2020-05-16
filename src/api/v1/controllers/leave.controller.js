const {
  MessageCodeConstants,
  StatusCodeConstants
} = require('../../../constants');
const { Response } = require('../../../utils');
const { LeaveService } = require('../services');
const { LeavesHelper } = require('../helpers');

module.exports = {
  /**
   * Monthly Update the Leaves of all employees
   */
  updateLeaveOfAllUsers: async (req, res) => {
    try {
      const result = await LeaveService.updateLeavesOfAllUsers();
      if (result.success) {
        return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
          MessageCodeConstants.LEAVES.UPDATED_ALL,
          {},
          StatusCodeConstants.SUCCESS
        ));
      }
      return res.status(result.error.code).json(result.error);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        code,
        error
      ));
    }
  },
  /**
   * Apply Leave
   */
  applyLeaveOfAUser: async (req, res) => {
    try {
      const employeeWhoAppliedLeave = req;
      const result = await LeavesHelper.leaveApply(employeeWhoAppliedLeave);
      if (result && result.success) {
        return res.status(result.data.responseCode).json(result.data);
      }
      return res.status(result.error.responseCode).json(result.error);
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }
};
