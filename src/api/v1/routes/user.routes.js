const router = require('express').Router();
const { UserController } = require('../controllers');

router.use('/create', UserController.create);
module.exports = router;
