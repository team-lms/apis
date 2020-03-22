const router = require('express').Router();
const { EmployeeController } = require('../controllers');
// const { AuthMiddleware } = require('../middlewares');

// router.use(AuthMiddleware.checkAuth);


router.post('/get', EmployeeController.getAll);
router.post('/create', EmployeeController.)

module.exports = router;
