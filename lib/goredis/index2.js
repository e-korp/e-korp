const ioredis = require('ioredis');

// TODO: Dependency injection for easier testing?
const goredis = (mongoose, ioredis) => {

  // TODO: Connect to redis

  // TODO: Override exec, find, save etc here
  console.log(mongoose.Query);

  return mongoose;
};

module.exports = goredis;
