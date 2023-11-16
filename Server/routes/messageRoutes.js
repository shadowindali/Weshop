const express = require('express');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/', authController.protect, messageController.createmessage);

router.get('/', authController.protect, messageController.getallmessage);

router.get('/:id', authController.protect, messageController.getchatmessage);

router.delete('/deleteall', authController.protect, messageController.deleteAll);

module.exports = router;
