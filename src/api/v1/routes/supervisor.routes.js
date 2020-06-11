const router = require('express').Router();
const { SupervisorController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.get('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.SUPERVISOR.GET_ALL),
  SupervisorController.getAllSuperVisors);

router.post('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.SUPERVISOR.CREATE),
  SupervisorController.createASupervisor);

router.patch('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.SUPERVISOR.UPDATE),
  SupervisorController.updateSupervisorById);

router.delete('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.SUPERVISOR.DELETE),
  SupervisorController.deleteSupervisorById);

module.exports = router;
