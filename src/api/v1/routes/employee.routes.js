const router = require('express').Router();
const { EmployeeController } = require('../controllers');
// const { AuthMiddleware } = require('../middlewares');

// router.use(AuthMiddleware.checkAuth);

router.get('/', EmployeeController.getAllEmployees);
router.patch('/:id', EmployeeController.updatedEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
