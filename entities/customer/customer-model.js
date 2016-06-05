const mongoose = require('mongoose');
const uuid = require('uuid');
// const goredis = require('../../lib/goredis');
// const validator = require('validator');

// Import User schema to use as base schema
const User = require('../user/user-model');

/**
 * Customer model (extends user model)
 */

const options = {
  discriminatorKey: 'kind',
  _id: false // Use the User-schemas ID
};

const customerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    max: 200,
  },
  lastname: {
    type: String,
    max: 200,
  },
  activationcode: {
    type: String,
    select: false,
    'default': uuid.v4
  },
  addresses: [{
    _id: false,
    street: {
      type: String
    },
    city: {
      type: String
    },
    zip: {
      type: String // Not all countries has integer zip codes
    },
    state: {
      type: String // TODO: Reference states by an ID
    },
    country: {
      type: String // TODO: Reference country by an ID
    }
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, options);

// Attach Redis cache to the model
// userSchema.plugin(goredis);

// Extend user schema
module.exports = User.discriminator('Customer', customerSchema);
