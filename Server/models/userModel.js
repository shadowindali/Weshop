const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
    validate: {
      validator: validator.isEmail,
      message: 'Email is not vailed',
    },
  },
  photo: { type: String, default: 'default.webp' },
  age: Number,
  phonenumber: Number,
  aboutus: String,
  role: {
    type: String,
    enum: ['admin', 'user', 'superadmin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password has to be above 8 digits'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password has to be above 8 digits'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "passwords doesn't match",
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.methods.matchPassword = function (password, encryptedpassword) {
  return bcrypt.compare(password, encryptedpassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() + 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
