const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Like a post
router.post('/like', async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send({ success: false, message: 'Post not found' });

    // Check if already liked
    if (post.likes.some(like => like.userId.toString() === userId)) {
      return res.status(400).send({ success: false, message: 'Already liked' });
    }

    post.likes.push({ userId, username: req.body.username }); // Adjust to receive username as well
    await post.save();

    res.send({ success: true, post });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Comment on a post
router.post('/posts/comment', async (req, res) => {
  const { postId, userId, username, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send({ success: false, message: 'Post not found' });

    post.comments.push({ userId, username, text });
    await post.save();

    res.send({ success: true, post });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Other post-related routes can be added here

module.exports = router;
