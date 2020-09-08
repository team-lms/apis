const router = require('express').Router();
const { UserController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.put(
  '/profile-picture/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.USER.UPDATE_PROFILE_PICTURE),
  MulterMiddleware.checkAndCreateDir,
  MulterMiddleware.upload().single('profilePicture'),
  UserController.updateProfilePicture
);
router.put(
  '/:id',
  UserController.updateProfile
);
router.get(
  '/',
  UserController.getProfile
);

module.exports = router;
