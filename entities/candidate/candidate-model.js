const mongoose = require('mongoose');
const validator = require('validator');

const options = {
  timestamps: true
};

const candidateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [(email) => {
      return validator.isEmail(email);
    }, 'Invalid email address'],
  },
}, options);

module.exports = mongoose.model('Candidate', candidateSchema);
