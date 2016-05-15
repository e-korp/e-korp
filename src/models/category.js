const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    select: false,
  },
  image: {
    type: String,
    select: false,
  },
  level: {
    type: Number,
    'default': 0,
  },
  position: {
    type: Number,
    'default': 0,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = {
  model: categoryModel,
  schema: categorySchema,
};
