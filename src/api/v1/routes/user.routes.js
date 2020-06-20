const router = require('express').Router();
const { UserController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.patch(
  '/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.UPDATE),
  MulterMiddleware.upload().single('profilePicture'),
  UserController.updateEmployee
);

module.exports = router;
