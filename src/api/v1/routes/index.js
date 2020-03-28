const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const employeeRoutes = require('./employee.routes');
const superVisorRoutes = require('./supervisor.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/supervisor', superVisorRoutes);

module.exports = router;
