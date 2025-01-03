const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Compare password for login
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add token to admin
AdminSchema.methods.addToken = async function(token) {
  this.tokens = this.tokens.concat({ token });
  await this.save();
};

module.exports = mongoose.model('Admin', AdminSchema);
