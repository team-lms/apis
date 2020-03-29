const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const employeeRoutes = require('./employee.routes');
const superVisorRoutes = require('./supervisor.routes');
const humanResourceRoutes = require('./hr.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/supervisor', superVisorRoutes);
router.use('/hr', humanResourceRoutes);

module.exports = router;
