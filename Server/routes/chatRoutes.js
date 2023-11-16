const express = require('express');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/', authController.protect, chatController.createchat);

router.get('/', authController.protect, chatController.getallchat);

router.get('/:id', authController.protect, chatController.getmychat);

router.get('/onechat/:id', authController.protect, chatController.getonechat);

router.delete(
  '/onechat/:id',
  authController.protect,
  chatController.deletechat
);

module.exports = router;
