const { StatusCodeConstants, MessageCodeConstants } = require('../constants');

class ApiError extends Error {
  constructor(message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.code = code;
  }
}

class ValidationError extends ApiError {
  constructor(message = MessageCodeConstants.VALIDATION_ERROR, error = {}) {
    super(message, StatusCodeConstants.UN_PROCESSABLE_ENTITY);
    this.error = error
  }

}

module.exports= {
  ValidationError
}
