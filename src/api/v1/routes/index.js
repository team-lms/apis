const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const employeeRoutes = require('./employee.routes');
const superVisorRoutes = require('./supervisor.routes');
const humanResourceRoutes = require('./hr.routes');
const teamRoutes = require('./teams.routes');
const leaveRoutes = require('./leaves.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/supervisor', superVisorRoutes);
router.use('/hr', humanResourceRoutes);
router.use('/team', teamRoutes);
router.use('/leave', leaveRoutes);

module.exports = router;
