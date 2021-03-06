const router = require('express').Router();
const { UserController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.put(
  '/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.USER.UPDATE_PROFILE_PICTURE),
  MulterMiddleware.checkAndCreateDir,
  MulterMiddleware.upload().single('profilePicture'),
  UserController.updateProfilePicture
);

module.exports = router;
