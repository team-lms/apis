/* eslint-disable max-classes-per-file */
const { StatusCodeConstants, MessageCodeConstants } = require('../constants');

class ApiError extends Error {
  constructor(message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.code = code;
  }
}

class InternalServerError extends ApiError {
  constructor(message = MessageCodeConstants.INTERNAL_SERVER_ERROR, error = {}) {
    super(message, StatusCodeConstants.INTERNAL_SERVER_ERROR);
    this.error = error;
  }
}

class ResourceAlreadyExistError extends Error {
  constructor(message = MessageCodeConstants.ALREADY_EXIST, error = {}) {
    super(message, StatusCodeConstants.RESOURCE_EXISTS);
    this.error = error;
  }
}

class ValidationError extends ApiError {
  constructor(message = MessageCodeConstants.VALIDATION_ERROR, error = {}) {
    super(message, StatusCodeConstants.UN_PROCESSABLE_ENTITY);
    this.error = error;
  }
}

module.exports = {
  InternalServerError,
  ResourceAlreadyExistError,
  ValidationError
};
