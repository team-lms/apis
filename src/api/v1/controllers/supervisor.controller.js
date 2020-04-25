const {
  StatusCodeConstants,
  QueryConstants,
  RolesConstants,
  MessageCodeConstants,
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
   * Get Supervisor List
   */
  getAllSuperVisors: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        search: (queryFilters.search) || (QueryConstants.SEARCH),
        offset: Number(queryFilters.offset) || (QueryConstants.OFFSET),
        limit: Number(queryFilters.limit) || (QueryConstants.LIMIT),
        sortType: (queryFilters.sortType) || (QueryConstants.SORT_TYPE[0]),
        sortBy: (queryFilters.sortField) || (QueryConstants.SORT_BY)
      };
      const supervisors = await UserService.getAllUsers({
        role: RolesConstants.SUPERVISOR
      }, filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.SUPERVISOR.FETCHED,
        supervisors,
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },
  /**
 * Update Supervisor By Id
 * */
  updateSupervisorById: async (req, res) => {
    try {
      const reqBody = req.body;
      const { id: userId } = req.params;
      const supervisorToBeUpdated = {
        ...(reqBody.firstName && { firstName: reqBody.firstName }),
        ...(reqBody.lastName && { lastName: reqBody.lastName }),
        ...(reqBody.email && { email: reqBody.email }),
        ...(reqBody.phoneNumber && { phoneNumber: reqBody.phoneNumber }),
        ...(reqBody.whatsappNumber && { whatsappNumber: reqBody.whatsappNumber }),
        ...(reqBody.designation && { designation: reqBody.designation }),
        ...(reqBody.role && { role: reqBody.role }),
        ...(reqBody.status && { status: reqBody.status })
      };
      const validationResult = Validator.validate(supervisorToBeUpdated, {
        email: { presence: { allowEmpty: false }, email: true },
        phoneNumber: {
          presence: { allowEmpty: false },
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH }
        },
        whatsappNumber: {
          numericality: { onlyInteger: true },
          length: { is: ValidationConstant.PHONE_NUMBER_LENGTH }
        },
        designation: { presence: { allowEmpty: false } },
        role: { presence: { allowEmpty: false } }
      });
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.ValidationError, validationResult);
      }
      const foundUser = await UserService.findUserByEmailOrPhone(supervisorToBeUpdated, userId);
      if (foundUser) {
        if (foundUser.email === supervisorToBeUpdated.email) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.EMAIL_ALREADY_EXISTS);
        }
        if (foundUser.phoneNumber === supervisorToBeUpdated.phoneNumber) {
          throw new ApiError.ResourceAlreadyExistError(MessageCodeConstants.PHONE_ALREADY_EXISTS);
        }
      }
      await UserService.updateUserById(supervisorToBeUpdated, userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.UPDATED,
        supervisorToBeUpdated,
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.status(code).json(Response.sendError(
        message,
        error,
        code
      ));
    }
  },
  /**
   * Delete Supervisor by Id
   */

  deleteSupervisorById: async (req, res) => {
    try {
      const { id: userId } = req.params;
      await UserService.deleteUserById(userId);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.DELETED,
        {},
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return res.send(code).json(Response.sendError(
        message,
        code,
        error
      ));
    }
  }
};
