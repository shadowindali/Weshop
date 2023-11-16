const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      minlength: [4, 'Name has to be above 4 letters'],
      maxlength: [40, 'Name has to be less than 40 letters'],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    location: {
      type: String,
    },
    picture: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    available: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('item', itemSchema);

module.exports = Item;
