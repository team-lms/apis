const router = require('express').Router();
const { SupervisorController } = require('../controllers');

router.get('/', SupervisorController.getAllSuperVisors);
router.patch('/:id', SupervisorController.updateSupervisorById);
router.delete('/:id', SupervisorController.deleteSupervisorById);

module.exports = router;