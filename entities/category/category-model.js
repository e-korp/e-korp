const mongoose = require('mongoose');
// const Product = require('../product/product-model');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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

// Provide virtual attribute for getting product count in this category
// categorySchema.method('getProductCount', callback => {
//   Product.count({categories: this._id}, (err, count) => {
//     if (err) {
//       return callback(err);
//     }
//
//     callback(null, count);
//   });
// });

module.exports = mongoose.model('Category', categorySchema);
