const router = require('express').Router();
const { HrController } = require('../controllers');
const { MulterMiddleware } = require('../middlewares');

router.get('/', HrController.getAllHumanResources);
router.post('/', HrController.createAHumanResource);
router.patch(
  '/:id',
  MulterMiddleware.upload().single('profilePicture'),
  HrController.updateAHumanResourceById
);
router.delete('/:id', HrController.deleteHumanResourceById);

module.exports = router;
