const mongoose = require('mongoose');

/**
 * General user model
 */

const userModel = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
}));

module.exports = userModel;
