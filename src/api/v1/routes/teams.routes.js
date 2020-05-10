const router = require('express').Router();
const { TeamController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.get('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.TEAM.GET_ALL),
  TeamController.getAllTeams);

router.post('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.TEAM.CREATE),
  TeamController.createTeam);

router.patch('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.TEAM.UPDATE),
  TeamController.updateATeam);

router.delete('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.TEAM.DELETE),
  TeamController.deleteATeam);

module.exports = router;
