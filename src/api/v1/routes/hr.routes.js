const router = require('express').Router();
const { HrController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);
router.post(
  '/',
  AuthMiddleware.checkAuthByRole(AccessConstants.HUMAN_RESOURCE.CREATE),
  HrController.createNewHumanResource
);
router.get(
  '/',
  AuthMiddleware.checkAuthByRole(AccessConstants.HUMAN_RESOURCE.GET_ALL),
  HrController.getAllHumanResources
);
router.patch(
  '/:id',
  MulterMiddleware.upload().single('profilePicture'),
  HrController.updateAHumanResourceById
);
router.delete('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.HUMAN_RESOURCE.DELETE),
  HrController.deleteHumanResourceById);

module.exports = router;
