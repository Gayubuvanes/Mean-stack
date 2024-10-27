const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/socialMediaApp')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Post schema and model for comments
const postSchema = new mongoose.Schema({
    userId: String,
    postId: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(200).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email or password is incorrect.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email or password is incorrect.' });
        }

        // If login is successful
        return res.status(200).json({ message: 'Login successful!', userId: user._id });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Like route
app.post('/api/like', (req, res) => {
    const { userId, postId } = req.body;
    // Your logic to update the post in the database (e.g., add a like)
    res.json({ success: true, message: 'Like saved' });
});

// Comment route
app.post('/api/posts/comment', async (req, res) => {
    const { postId, userId, text } = req.body;

    try {
        // Create a new comment without attaching the username
        const newComment = new Post({
            postId,
            userId,
            text
        });

        await newComment.save();
        res.json({ success: true, message: 'Comment added' });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ success: false, message: 'Error saving comment', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
