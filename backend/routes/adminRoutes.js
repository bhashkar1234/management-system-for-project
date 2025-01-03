const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    res.send({ admin, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
