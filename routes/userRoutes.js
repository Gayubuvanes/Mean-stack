const express = require('express');
const router = express.Router();
const User = require('../models/user');

// User registration example (hashed password should be stored)
router.post('/register', async (req, res) => {
  const { username, password, email, avatar } = req.body;

  try {
    const user = new User({ username, password, email, avatar });
    await user.save();
    res.status(201).send({ success: true, user });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Other user-related routes can be added here

module.exports = router;
