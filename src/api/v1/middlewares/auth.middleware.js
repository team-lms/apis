/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
const { Response } = require('../../../utils');

module.exports = {

  /**
   * Check wether the token is valid or not
   */
  checkAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ').pop().trim();
      const { data: userInfoString } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userInfo = JSON.parse(userInfoString);
      next();
    } catch (error) {
      return res.status(StatusCodeConstants.UNAUTHORIZED).json(Response.sendError(
        MessageCodeConstants.UNAUTHORIZED_USER,
        {},
        StatusCodeConstants.UNAUTHORIZED
      ));
    }
  },

  /**
   * Check auth by role
   * This middleware must be used after checkAuth middleware
   * as it uses the logged in user's info
   */

  checkAuthByRole: (roles) => (req, res, next) => {
    if (roles.indexOf(req.userInfo.role) > -1) {
      next();
    } else {
      return res.status(StatusCodeConstants.UNAUTHORIZED).json(Response.sendError(
        MessageCodeConstants.UNAUTHORIZED_USER,
        {},
        StatusCodeConstants.UNAUTHORIZED
      ));
    }
  }
};
