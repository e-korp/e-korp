const mongoose = require('mongoose');
const validator = require('validator');

/**
 * General user model
 */

const options = {
  discriminatorKey: 'kind', // To be able to extend this schema
  timestamps: true // Add createdAt and updatedAt to the schema
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [(email) => {
      return validator.isEmail(email);
    }, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: Number,
    min: 0,
    max: 50,
  },
}, options);

module.exports = mongoose.model('User', userSchema);
