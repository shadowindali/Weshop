const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      min: 1,
      trim: true,
    },
    date: Date,
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
    chat: {
      type: mongoose.Schema.ObjectId,
      ref: 'chat',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
