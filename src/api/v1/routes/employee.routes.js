const router = require('express').Router();
const { EmployeeController } = require('../controllers');
// const { AuthMiddleware } = require('../middlewares');

// router.use(AuthMiddleware.checkAuth);

router.get('/', EmployeeController.getAllEmployees);
router.patch('/:id', EmployeeController.editEmployee);

module.exports = router;
