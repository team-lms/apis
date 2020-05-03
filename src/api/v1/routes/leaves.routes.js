const router = require('express').Router();
const { LeaveController } = require('../controllers');

router.post('/update-all', LeaveController.updateLeaveOfAllUsers);
module.exports = router;
