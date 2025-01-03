const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received token:', token); // Log token for debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log decoded payload

    const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!admin) {
      throw new Error('Admin not found or token is invalid');
    }

    req.token = token;
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message); // Log error message
    res.status(401).send({ error: 'Please authenticate as admin' });
  }
};

module.exports = auth;
