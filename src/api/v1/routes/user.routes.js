const router = require('express').Router();
const { UserController } = require('../controllers');
const { MulterMiddleware } = require('../middlewares');

router.post(
  '/',
  MulterMiddleware.checkAndCreateDir,
  MulterMiddleware.upload().single('profilePicture'),
  UserController.createUser
);

module.exports = router;
