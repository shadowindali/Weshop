const Chat = require('../models/chatModel');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const checkexistingchat = async (myId, partnerId) => {
  const chat = await Chat.findOne({
    participants: { $all: [myId, partnerId] },
  });
  console.log(chat);
  if (chat) return chat;

  return null;
};

exports.createchat = catchAsync(async (req, res) => {
  let chat = await checkexistingchat(req.user.id, req.body.userId);
  if (chat !== null)
    return res.status(200).json({ message: 'Done', data: chat });

  chat = await Chat.create({
    participants: [req.user.id, req.body.userId],
  });
  res.status(201).json({ message: 'Chat created successfully', data: chat });
});

exports.getallchat = catchAsync(async (req, res) => {
  const chat = await Chat.find();
  res.status(201).json({ message: 'Done', data: chat });
});

exports.getmychat = catchAsync(async (req, res) => {
  const chat = await Chat.find({ participants: req.params.id }).populate(
    'participants'
  );
  res.status(201).json({ message: 'Done', data: chat });
});

exports.getonechat = catchAsync(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.status(201).json({ message: 'Done', data: chat });
});

exports.deletechat = catchAsync(async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.status(201).json({ message: 'Done' });
});
