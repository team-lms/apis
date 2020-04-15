const UserService = require('./user.service');
const TeamAssociationsService = require('./teamAssociations');
const { StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
const { Response } = require('../../../utils');
const { sequelize } = require('../../../../models');

const EmployeeService = {
  createANewEmployee: async (employeeToBeCreated) => {
    const transaction = await sequelize.transaction();
    try {
      const createdUser = await UserService.createUser(employeeToBeCreated, transaction);
      const teamToBeAssociated = {
        userId: createdUser.id,
        isSupervisor: 0
      };
      await TeamAssociationsService
        .associateATeam(teamToBeAssociated, transaction);
      transaction.commit();
      const user = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        password: MessageCodeConstants.PASSWORD_SENT_SUCCESSFULLY,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
        whatsappNumber: createdUser.whatsappNumber,
        designation: createdUser.designation,
        role: createdUser.role,
        status: createdUser.status,
        employeeId: createdUser.employeeId,
        profilePicture: createdUser.profilePicture,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt
      };
      return {
        success: true,
        data: Response.sendSuccess(
          MessageCodeConstants.USER_CREATED_SUCCESSFULLY,
          { user },
          StatusCodeConstants.SUCCESS
        )
      };
    } catch ({ message, code = StatusCodeConstants, error }) {
      if (transaction) {
        transaction.rollback();
      }
      return {
        success: false,
        data: {},
        error: Response.sendError(message, error, code)
      };
    }
  }

};
module.exports = EmployeeService;
