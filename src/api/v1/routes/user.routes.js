const router = require('express').Router();
const { UserController } = require('../controllers');
const { MulterMiddleware, AuthMiddleware } = require('../middlewares');

router.post(
  '/',
  AuthMiddleware.checkAuth,
  MulterMiddleware.checkAndCreateDir,
  MulterMiddleware.upload().single('profilePicture'),
  UserController.createUser
);

module.exports = router;
