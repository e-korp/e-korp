const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
* General product model
*/

const productSchema = new Schema({
  name: String,
  materials: String,
  description: String,
  shortdescription: String,
  size: String,
  colors: [
    String,
  ],
  sku: String, // Should not be needed...

  // TODO: Break out images to own model?
  images: [{
    front: {
      type: Boolean,
      'default': false,
    },
    thumb: String,
    medium: String,
    large: String,
  }],

  // A product may be placed in multiple categories
  categories: [{
    type: Schema.Types.ObjectId, ref: 'Category',
  }],
}, {
  timestamps: true,
});

// TODO: export the schema for extending
module.exports = mongoose.model('Product', productSchema);
