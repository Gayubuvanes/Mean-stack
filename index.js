// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/socialMediaDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Post schema
const postSchema = new mongoose.Schema({
    user: { type: String, required: true },
    content: { type: String, required: true },
    image: String,
    likes: [{ type: String }], // User IDs who liked the post
    comments: [{ username: String, text: String }],
});

const Post = mongoose.model('Post', postSchema);

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Like a post
app.post('/api/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body; // Assuming you are sending the user ID who liked the post

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        // Check if the user already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'Post already liked by this user.' });
        }

        post.likes.push(userId);
        await post.save();
        res.json({ message: 'Post liked successfully!', likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Comment on a post
app.post('/api/posts/:id/comment', async (req, res) => {
    const postId = req.params.id;
    const { username, text } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        post.comments.push({ username, text });
        await post.save();
        res.json({ message: 'Comment added successfully!', comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
