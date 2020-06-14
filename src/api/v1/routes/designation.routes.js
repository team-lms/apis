const router = require('express').Router();
const { AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');
const DesignationController = require('../controllers/designation.controller');

router.use(AuthMiddleware.checkAuth);

router.post('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.DESIGNATION.CREATE),
  DesignationController.createADesignation);

router.get('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.DESIGNATION.GET_ALL),
  DesignationController.getAllDesignation);

router.put('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.DESIGNATION.UPDATE),
  DesignationController.updateDesignationById);

module.exports = router;
