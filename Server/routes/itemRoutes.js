const express = require('express');
const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(itemController.getAllavailableitems)
  .post(
    authController.protect,
    itemController.upload.single('file'),
    itemController.createItem
  );

router.get(
  '/allitems',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  itemController.getAllitems
);

router.patch(
  '/setavailable/:id',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  itemController.makeAvailable
);

router.get(
  '/unavailable',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  itemController.getAllunavailableitems
);

router.delete(
  '/deleteall',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  itemController.deleteAll
);

router.get('/getmine', authController.protect, itemController.getMyItems);

router.delete('/:id', authController.protect, itemController.deleteByID);

router
  .route('/:id')
  .patch(authController.protect, itemController.updateItem)
  .get(itemController.getItem);

module.exports = router;
