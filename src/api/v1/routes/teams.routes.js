const router = require('express').Router();
const { TeamController } = require('../controllers');


router.get('/', TeamController.getAllTeams);
router.post('/', TeamController.createTeam);

module.exports = router;
