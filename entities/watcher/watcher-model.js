const mongoose = require('mongoose');
const states = require('./states');
const applog = require('winston').loggers.get('applog');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: Number,
    'default': states.NONE,
  },
  logs: [{
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    stackTrace: {
      type: Object,
    },
    level: {
      type: Number,
    },
    data: {
      type: Object,
    },
    time: {
      type: Date,
    },
  }],
}, {
  timestamps: true,
});

schema.pre('find', function(next) {
  // TODO: Check for cached entry based on query params
  next();
});

schema.post('find', function(next) {
  // TODO: Add the record to the cache (on create and update aswell)
});

module.exports = mongoose.model('Watcher', schema);
