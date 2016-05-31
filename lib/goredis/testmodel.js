const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: String,
  rating: Number,
});

module.exports = mongoose.model('Testmodel', testSchema);
