const router = require('express').Router();
const { UserController } = require('../controllers');

router.post('/', UserController.createUser);

module.exports = router;
