const mongoose = require('mongoose');
const goredis = require('../../lib/goredis');
const validator = require('validator');

/**
 * General user model
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 40,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [(email) => {validator.isEmail(email);}, 'Invalid email address'],
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
}, {
  timestamps: true,
});

// Attach Redis cache to the model
// userSchema.plugin(goredis);

module.exports = mongoose.model('User', userSchema);
