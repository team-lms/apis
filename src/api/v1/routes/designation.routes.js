const router = require('express').Router();
const { AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');
const DesignationController = require('../controllers/designation.controller');

router.use(AuthMiddleware.checkAuth);

router.post('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.DESIGNATION.CREATE),
  DesignationController.createADesignation);

module.exports = router;
