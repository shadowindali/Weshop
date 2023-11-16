const multer = require('multer');
const path = require('path');
const Item = require('../models/itemModel');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.getAllavailableitems = catchAsync(async (req, res) => {
  const items = await Item.find({ available: true });
  res.status(201).json({ message: 'Items', data: items });
});

exports.getAllunavailableitems = catchAsync(async (req, res) => {
  const items = await Item.find({ available: false });
  res.status(201).json({ message: 'Items', data: items });
});

exports.getAllitems = catchAsync(async (req, res) => {
  const items = await Item.find();
  res.status(201).json({ message: 'Items', data: items });
});

exports.getItem = catchAsync(async (req, res) => {
  const items = await Item.findById(req.params.id).populate('user');
  res.status(201).json({ message: 'Item By Id', data: items });
});

exports.getMyItems = catchAsync(async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.status(201).json({ message: 'Item By Id', data: items });
});

exports.makeAvailable = catchAsync(async (req, res) => {
  const items = await Item.findByIdAndUpdate(
    req.params.id,
    {
      available: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({ message: 'done', data: items });
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

// End

exports.createItem = catchAsync(async (req, res) => {
  if (!req.body.user) req.body.user = req.user.id;
  const item = await Item.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    user: req.user.id,
    picture: req.file.filename,
  });
  res.status(201).json({ message: 'Item created successfully', data: item });
});
3;

exports.updateItem = catchAsync(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ message: 'Successfully Updated', data: item });
});

exports.deleteAll = catchAsync(async (req, res) => {
  await Item.deleteMany({});
  res.status(200).json({ message: 'Successfully Deleted' });
});

exports.deleteByID = catchAsync(async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Successfully Deleted' });
});
