const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword});
    await user.save();
  

    res.json({ message: 'User registered successfully' });
  } catch (err) {
   
    res.status(500).send({ message: err.message });
  }
});

router.post('/signin', async (req, res) => {


  try {
    const { username, password} = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
   
    const token = jwt.sign({ username: user.username ,userId: user._id}, 'secretkey');
    res.status(200).json({ token,message: 'User logged in successfully'  });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
