const mongoose = require('mongoose');
const states = require('./states');

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Log',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Watcher', schema);
