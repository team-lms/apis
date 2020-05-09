const jwt = require('jsonwebtoken');
const { StatusCodeConstants, MessageCodeConstants } = require('../../../constants');
const { Response, Crypto } = require('../../../utils');

module.exports = {
  // eslint-disable-next-line consistent-return
  checkAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ').pop().trim();
      const { data: hashInfo } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userInfo = JSON.parse(Crypto.decrypt(hashInfo));
      req.userInfo = userInfo;
      next();
    } catch (error) {
      return res.status(StatusCodeConstants.UNAUTHORIZED).json(Response.sendError(
        MessageCodeConstants.UNAUTHORIZED_USER,
        {},
        StatusCodeConstants.UNAUTHORIZED
      ));
    }
  },

  /* Check Auth By Role */


  checkAuthByRole: (roles) => (req, res, next) => {
    if (roles.indexOf(req.userInfo.role) > -1) {
      next();
    }
    return res.status(StatusCodeConstants.UNAUTHORIZED).json(Response.sendError(
      MessageCodeConstants.UNAUTHORIZED_USER,
      {},
      StatusCodeConstants.UNa
    ));
  }
};
