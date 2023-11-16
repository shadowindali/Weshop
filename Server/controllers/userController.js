const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const filterBody = (obj, ...allowed) => {
  const allowedattribute = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) allowedattribute[el] = obj[el];
  });
  return allowedattribute;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({ status: 'done', data: { users } });
});

exports.getUser = catchAsync(async (req, res) => {
  const users = await User.findById(req.user.id);

  res.status(200).json({ status: 'done', data: { users } });
});

exports.updateMe = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm)
    return res.status(400).json({ message: 'Cant change password here.' });

  const filteredBody = filterBody(
    req.body,
    'name',
    'email',
    'photo',
    'age',
    'phonenumber',
    'aboutus'
  );

  const updateduser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'done',
    message: 'User Updated',
    data: { user: updateduser },
  });
});

exports.updatePhoto = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm)
    return res.status(400).json({ message: 'Cant change password here.' });

  const filteredBody = filterBody(req.body, 'photo');

  const updateduser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'done',
    message: 'User Updated',
    data: { user: updateduser },
  });
});

exports.makeadmin = catchAsync(async (req, res) => {
  const updateduser = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'admin' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'done',
    message: 'User Updated',
    data: { user: updateduser },
  });
});

exports.makeuser = catchAsync(async (req, res) => {
  const updateduser = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'user' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'done',
    message: 'User Updated',
    data: { user: updateduser },
  });
});

exports.deleteaccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id,
    { active: 'false' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'done',
    message: 'User Deleted',
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { active: 'false' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'done',
    message: 'User Deleted',
  });
});

// Uploading imagessssssssssssssssssssssssss

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

exports.upload = multer({
  storage: storage,
});

exports.updateimage = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { photo: req.file.filename },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: 'done' });
});

// delete imageeeee
exports.deleteimage = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { photo: 'default.webp' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: 'done' });
});
