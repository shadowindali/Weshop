const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);

chatSchema.pre('save', async function (next) {
  const participants = this.participants.slice(); // Create a copy to avoid modifying the original array
  participants.sort(); // Sort the participants array

  const existingChat = await this.constructor.findOne({
    participants: participants,
  });

  if (existingChat) {
    const error = new Error('Chat with the same participants already exists.');
    return next(error);
  }
  next();
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
