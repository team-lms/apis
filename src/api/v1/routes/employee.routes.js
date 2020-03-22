const router = require('express').Router();
const { EmployeeController } = require('../controllers');
// const { AuthMiddleware } = require('../middlewares');

// router.use(AuthMiddleware.checkAuth);

router.get('/', EmployeeController.getAllEmployees);

module.exports = router;
