const router = require('express').Router();
const { AuthController } = require('../controllers');

router.use('/register', AuthController.login);
// router.use('/login');
module.exports = router;
