const router = require('express').Router();
const { EmployeeController } = require('../controllers');
const { MulterMiddleware } = require('../middlewares');

router.get('/', EmployeeController.getAllEmployees);
router.patch(
  '/:id',
  MulterMiddleware.upload().single('profilePicture'),
  EmployeeController.updateEmployee
);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
