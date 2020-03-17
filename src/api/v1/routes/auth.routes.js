const router = require('express').Router();
const { AuthController } = require('../controllers');

// router.use('/register', AuthController.login);
router.use('/login', AuthController.login);
router.use('/sendOtp', AuthController.sendOtp);
router.use('/verifyOtp', AuthController.verifyOtp);
module.exports = router;
