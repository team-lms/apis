const router = require('express').Router();
const { EmployeeController, UserController } = require('../controllers');
const { MulterMiddleware, AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.get('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.GET_ALL),
  EmployeeController.getAllEmployees);

router.post('/',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.CREATE),
  MulterMiddleware.checkAndCreateDir,
  MulterMiddleware.upload().single('profilePicture'),
  UserController.createUser);

router.patch(
  '/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.UPDATE),
  MulterMiddleware.upload().single('profilePicture'),
  EmployeeController.updateEmployee
);

router.delete('/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.DELETE),
  EmployeeController.deleteEmployee);

module.exports = router;
