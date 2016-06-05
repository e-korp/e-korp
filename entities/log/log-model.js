const mongoose = require('mongoose');
// const goredis = require('../../lib/goredis');

const options = {
  timestamps: true
};

const logSchema = new mongoose.Schema({
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
}, options);

// logSchema.plugin(goredis);

module.exports = mongoose.model('Log', logSchema);
