const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/social_media_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schemas
const likeSchema = new mongoose.Schema({
  userId: String,
  username: String,
  postId: String,
  timestamp: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  userId: String,
  username: String,
  postId: String,
  comment: String,
  timestamp: { type: Date, default: Date.now }
});

const Like = mongoose.model('Like', likeSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.post('/api/like', async (req, res) => {
  try {
    const { userId, username, postId } = req.body;
    const newLike = new Like({ userId, username, postId });
    await newLike.save();
    res.status(200).send({ message: 'Like saved successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving like', error });
  }
});

app.post('/api/comment', async (req, res) => {
  try {
    const { userId, username, postId, comment } = req.body;
    const newComment = new Comment({ userId, username, postId, comment });
    await newComment.save();
    res.status(200).send({ message: 'Comment saved successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving comment', error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
