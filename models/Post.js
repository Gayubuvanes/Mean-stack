const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: { type: String },
  likes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    text: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
