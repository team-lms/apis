const router = require('express').Router();
const { LeaveController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

router.use(AuthMiddleware.checkAuth);

router.post('/update-all', LeaveController.updateLeaveOfAllUsers);
router.post('/', LeaveController.applyLeaveOfAUser);
module.exports = router;
