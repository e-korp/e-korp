const mongoose = require('mongoose');

/**
* General product model
*/

const options = {
  discriminatorKey: 'kind', // To be able to extend this schema
  timestamps: true // Add createdAt and updatedAt to the schema
};

const productSchema = new mongoose.Schema({
  name: String,
  materials: String,
  description: String,
  shortdescription: String,
  size: String,
  colors: [
    String,
  ],
  sku: String,
  variations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  // A product may be placed in multiple categories
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
}, options);

module.exports = mongoose.model('Product', productSchema);
