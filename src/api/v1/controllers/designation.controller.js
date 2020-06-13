const Chalk = require('chalk');
const { Response, Validator, ApiError } = require('../../../utils');
const { StatusConstants, StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
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
      const validationResult = await Validator.validate(designationToBeCreated, {
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
  }
};
