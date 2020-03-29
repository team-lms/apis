const router = require('express').Router();
const { HrController } = require('../controllers');

router.get('/', HrController.getAllHumanResources);
module.exports = router;
