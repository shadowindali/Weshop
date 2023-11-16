const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const tokengenerator = (id) => {
  token = JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};

exports.signup = catchAsync(async (req, res) => {
  const { email, password, name, passwordConfirm } = req.body;
  if (!email || !password || !name || !passwordConfirm) {
    return res.status(400).json({
      status: 'failed',
      message: 'All information are needed!',
    });
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  token = tokengenerator(newUser._id);
  res.status(201).json({
    status: 'done',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 'failed',
      message: 'Email and Password are required',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password, user.password))) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invailed Email or Password',
    });
  }

  const token = tokengenerator(user._id);
  res.status(201).json({
    status: 'done',
    token,
    data: { user },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check Token if exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'You have to login.' });

  // Verify Token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // Check if user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return res.status(401).json({ message: "User doesn't exist." });

  // Check if password changed
  if (freshUser.changedPasswordAfter(decoded.iat))
    return res.status(401).json({ message: 'Password has been Changed.' });

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You dont have permission.' });
    }
    next();
  };
};

exports.changepassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentpassword, user.password)))
    return res
      .status(400)
      .json({ status: 'Failed.', message: 'Incorrect Current Password.' });

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = tokengenerator(user._id);
  res.status(201).json({
    status: 'done',
    token,
    data: { user },
  });
});
