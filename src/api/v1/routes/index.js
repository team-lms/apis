const router = require('express').Router();
const authRoutes = require('./auth.routes');
const designationRoutes = require('./designation.routes');
const employeeRoutes = require('./employee.routes');
const humanResourceRoutes = require('./hr.routes');
const leaveRoutes = require('./leaves.routes');
const superVisorRoutes = require('./supervisor.routes');
const teamRoutes = require('./teams.routes');
const userRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/designation', designationRoutes);
router.use('/employee', employeeRoutes);
router.use('/hr', humanResourceRoutes);
router.use('/leave', leaveRoutes);
router.use('/supervisor', superVisorRoutes);
router.use('/team', teamRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
