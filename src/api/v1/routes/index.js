const router = require('express').Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const employeeRoutes = require('./employee.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
module.exports = router;
