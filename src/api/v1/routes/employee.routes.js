const router = require('express').Router();
const { EmployeeController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');
const { AccessConstants } = require('../../../constants');

router.use(AuthMiddleware.checkAuth);

router.get(
  '/',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.GET_ALL),
  EmployeeController.getAllEmployees
);

router.post(
  '/',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.CREATE),
  EmployeeController.createEmployee
);

router.patch(
  '/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.UPDATE),
  EmployeeController.updateEmployee
);

router.delete(
  '/:id',
  AuthMiddleware.checkAuthByRole(AccessConstants.EMPLOYEE.DELETE),
  EmployeeController.deleteEmployee
);

module.exports = router;
