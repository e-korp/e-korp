const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stackTrace: {
    type: Object,
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
