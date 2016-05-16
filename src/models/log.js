const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Log', schema);
