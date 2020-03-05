const { StatusCodeConstants } = require('../constants');

const response = {
  success: false,
  message: '',
  data: {},
  responseCode: 200,
};

module.exports = {
  /**
   *
   * @param {string} message
   * @param {object} data
   * @param {integer} responseCode
   */
  sendError(message = '', data = {}, responseCode = StatusCodeConstants.BAD_REQUEST) {
    return {
      ...response,
      message,
      data,
      responseCode,
    };
  },

  /**
   *
   * @param {string} message
   * @param {object} data
   * @param {integer} responseCode
   */

  sendSuccess(message = '', data = '', responseCode = StatusCodeConstants.SUCCESS) {
    return {
      ...response,
      message,
      data,
      responseCode,
      success: true,
    };
  },
};
