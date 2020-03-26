const jwt = require('jsonwebtoken');
const { StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
const { Response } = require('../../../utils');

module.exports = {
  checkAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ').pop().trim();
      const { data: hashInfo } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      next();
      return token;
    } catch (error) {
      return res.status(StatusCodeConstants.UNAUTHORIZED).json(Response.sendError(
        MessageCodeConstants.UNAUTHORIZED_USER,
        {},
        StatusCodeConstants.UNAUTHORIZED
      ));
    }
  }
};
