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

module.exports = router;
