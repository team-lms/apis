const router = require('express').Router();
const { EmployeeController } = require('../controllers');
// const { AuthMiddleware } = require('../middlewares');

// router.use(AuthMiddleware.checkAuth);


router.post('/get', EmployeeController.getAll);

module.exports = router;
