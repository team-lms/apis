const router = require('express').Router();
const { UserController } = require('../controllers');

router.post('/create', UserController.create);
module.exports = router;
