const Chalk = require('chalk');
const {
  StatusCodeConstants,
  MessageCodeConstants,
  RolesConstants,
  QueryConstants,
  ValidationConstant
} = require('../../../constants');
const {
  Response,
  Validator,
  ApiError
} = require('../../../utils');
const { UserService } = require('../services');

module.exports = {
  /**
   * Get all Employees
   */
  getAllEmployees: async (req, res) => {
    try {
      const queryFilters = req.params;
      const filters = {
        search: (queryFilters.search) || (QueryConstants.SEARCH),
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.pageNo) || QueryConstants.LIMIT,
        sortType: queryFilters.orderBy || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortType || QueryConstants.SORT_BY
      };

      const employees = await UserService.getAllUsers({ role: RolesConstants.EMPLOYEE }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.EMPLOYEE_FETCHED,
        employees,
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },

  editEmployee: async (req, res) => {
    try {
      const editEmployeeBody = req.body;
      const userId = req.params.id;
      const employeeToBeEdited = {
        ...(editEmployeeBody.firstName && { firstName: editEmployeeBody.firstName }),
        ...(editEmployeeBody.lastName && { lastName: editEmployeeBody.lastName }),
        ...(editEmployeeBody.email && { email: editEmployeeBody.email }),
        ...(editEmployeeBody.phoneNumber && { phoneNumber: editEmployeeBody.phoneNumber }),
        ...(editEmployeeBody.whatsappNumber && { whatsappNumber: editEmployeeBody.whatsappNumber }),
        ...(editEmployeeBody.designation && { designation: editEmployeeBody.designation }),
        ...(editEmployeeBody.role && { role: editEmployeeBody.role }),
        ...(editEmployeeBody.status && { status: editEmployeeBody.status }),
      };
      const validationResult = Validator.validate(employeeToBeEdited, {
        // firstName: { presence: { allowEmpty: false } },
        email: { presence: { allowEmpty: false }, email: true },
        phoneNumber: {
          presence: { allowEmpty: false },
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.WHATS_APP_NUMBER_LENGTH }
        },
        whatsappNumber: {
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.WHATS_APP_NUMBER_LENGTH }
        },
        designation: { presence: { allowEmpty: false } },
        role: { presence: { allowEmpty: false } }
      });
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }
      const foundUser = await UserService.findUserByEmailOrPhone({
        email: employeeToBeEdited.email,
        phoneNumber: employeeToBeEdited.phoneNumber
      }, userId);
      if (foundUser) {
        throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.ALREADY_EXISTS);
      }
      const updatedUser = await UserService.updateUser(employeeToBeEdited, userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.EMPLOYEE.EMPLOYEE_UPDATED,
        updatedUser,
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  }

};
