const router = require('express').Router();
const { AuthController } = require('../controllers');


router.use('/register', AuthController.register);
module.exports = router;
