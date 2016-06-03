const mongoose = require('mongoose');
const ioredis = require('ioredis');

const Log = require('../../entities/log/log-model');

// TODO: Dependency injection for easier testing?
const goredis = (mongoose, ioredis) => {

  // Log.find({email: 'hej'}).limit(100).exec().then(result => {
  //   console.log('Result from find', result);
  // }).catch(err => {
  //   console.log('Error from find', err);
  // });


  // TODO: Override exec, find, save etc here
  //console.log(mongoose.Query);

  return mongoose;
};

//mongoose.connect('mongodb://localhost:27017/test');

goredis(mongoose, ioredis);

module.exports = goredis;
