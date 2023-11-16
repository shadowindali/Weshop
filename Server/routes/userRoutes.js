const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.patch(
  '/uploadimage',
  authController.protect,
  userController.upload.single('file'),
  userController.updateimage
);

router.patch('/deletimage', authController.protect, userController.deleteimage);

router.patch(
  '/changepassword',
  authController.protect,
  authController.changepassword
);

router.patch(
  '/makeadmin/:id',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  userController.makeadmin
);

router.patch(
  '/makeuser/:id',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  userController.makeuser
);

router.patch(
  '/deleteaccount/:id',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  userController.deleteaccount
);

router.patch('/deleteMe', authController.protect, userController.deleteMe);

router.get(
  '/getAllUsers',
  authController.protect,
  authController.restrictTo('admin', 'superadmin'),
  userController.getAllUsers
);
router.get('/getUser', authController.protect, userController.getUser);
module.exports = router;
