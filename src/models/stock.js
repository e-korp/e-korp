const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
* General stock model
*/

const stockSchema = new Schema({
  quantity: Number,
  product: {
    type: Schema.Types.ObjectId, ref: 'Product',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Stock', stockSchema);
