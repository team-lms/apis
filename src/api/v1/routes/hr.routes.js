const router = require('express').Router();
const { HrController } = require('../controllers');

router.get('/', HrController.getAllHumanResources);
router.post('/', HrController.createAHumanResource);
module.exports = router;
