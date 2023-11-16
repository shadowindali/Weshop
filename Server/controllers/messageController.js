const Message = require('../models/messageModel');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.createmessage = catchAsync(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({ status: 'done', message });
});

exports.getallmessage = catchAsync(async (req, res) => {
  const message = await Message.find();
  res.status(201).json({ status: 'done', message });
});

exports.getchatmessage = catchAsync(async (req, res) => {
  const message = await Message.find({ chat: req.params.id });
  res.status(201).json({ status: 'done', message });
});

exports.deleteAll = catchAsync(async (req, res) => {
  await Message.deleteMany();
  res.status(200).json({ message: 'Successfully Deleted' });
});
