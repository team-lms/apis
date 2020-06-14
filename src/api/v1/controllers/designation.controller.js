const Chalk = require('chalk');
const {
  Response,
  Validator,
  ApiError
} = require('../../../utils');
const {
  StatusConstants,
  StatusCodeConstants,
  MessageCodeConstants,
  QueryConstants
} = require('../../../constants');
const { DesignationService } = require('../services');

module.exports = {
  /**
   * Create A Designation
   */
  createADesignation: async (req, res) => {
    try {
      const reqBody = req.body;
      const designationToBeCreated = {
        name: reqBody.name,
        status: reqBody.status
      };
      const validationResult = Validator.validate(designationToBeCreated, {
        name: { presence: { allowEmpty: false } },
        status: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(StatusConstants).map((key) => StatusConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        }
      });
      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.ValidationError, validationResult);
      }
      const alreadyDesignation = await DesignationService
        .findDesignationByName(designationToBeCreated);
      if (alreadyDesignation) {
        throw new ApiError.ResourceAlreadyExistError(
          MessageCodeConstants.DESIGNATION_ALREADY_EXISTS
        );
      }
      await DesignationService.createADesignation(designationToBeCreated);
      return res.status(StatusCodeConstants.SUCCESS).json(
        Response.sendSuccess(
          MessageCodeConstants.DESIGNATION.CREATED,
          {},
          StatusCodeConstants.SUCCESS
        )
      );
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).json(Response.sendError(
        message,
        code,
        error
      ));
    }
  },

  /**
   * Get All Designation
   */
  getAllDesignation: async (req, res) => {
    try {
      const queryFilters = req.query;
      const filters = {
        searchTerm: queryFilters.searchTerm || QueryConstants.SEARCH_TERM,
        searchBy: queryFilters.searchBy || QueryConstants.SEARCH_BY,
        offset: Number(queryFilters.offset) || QueryConstants.OFFSET,
        limit: Number(queryFilters.limit) || QueryConstants.LIMIT,
        sortType: queryFilters.sortType || QueryConstants.SORT_TYPE[0],
        sortBy: queryFilters.sortBy || QueryConstants.SORT_BY
      };
      const designations = await DesignationService.getAllDesignations(filters);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.FETCHED,
        designations,
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
   * Designation To be Updated
   */

  updateDesignationById: async (req, res) => {
    try {
      const reqBody = req.body;
      const { id } = req.params;
      const designationToBeUpdated = {
        ...(reqBody.name && { name: reqBody.name }),
        ...(reqBody.status && { status: reqBody.status })
      };
      const validationResult = Validator.validate(designationToBeUpdated, {
        name: { presence: { allowEmpty: false } },
        status: {
          presence: { allowEmpty: false },
          inclusion: {
            within: Object.keys(StatusConstants).map((key) => StatusConstants[key]),
            message: MessageCodeConstants.IS_NOT_VALID
          }
        }
      });
      if (validationResult) {
        throw new ApiError.ResourceAlreadyExistError(
          MessageCodeConstants.VALIDATION_ERROR, validationResult
        );
      }

      const alreadyDesignation = await DesignationService.findDesignationByName(
        designationToBeUpdated, id
      );
      if (alreadyDesignation) {
        throw new ApiError.ResourceAlreadyExistError(
          MessageCodeConstants.DESIGNATION_ALREADY_EXISTS
        );
      }
      await DesignationService.updateDesignationById(designationToBeUpdated, id);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendSuccess(
        MessageCodeConstants.DESIGNATION.UPDATED,
        {},
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
   * Delete Designation
   */
  deleteDesignationById: async (req, res) => {
    try {
      const { id } = req.params;
      await DesignationService.deleteDesignationById(id);
      return res.status(StatusCodeConstants.SUCCESS).json(Response.sendError(
        MessageCodeConstants.DESIGNATION.DELETED,
        {},
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
