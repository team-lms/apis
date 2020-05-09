const router = require('express').Router();
const { TeamController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

router.use(AuthMiddleware.checkAuth);

router.get('/', TeamController.getAllTeams);

router.post('/', TeamController.createTeam);

module.exports = router;
