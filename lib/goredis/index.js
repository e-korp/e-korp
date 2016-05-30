const Redis = require('ioredis');
const cachelog = require('winston').loggers.get('cachelog');

/**
 * Redis cache plugin for Mongoose
 */

// Connect to Redis server
cachelog.info('Starting connection to Redis server');

const redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: null,
  db: 0,
});

redis.on('error', err => {
  cachelog.error('Redis error', err);
});

redis.monitor((err, monitor) => {
  if (err) {
    cachelog.error('Redis error', err);
  }

  cachelog.info('Listening to Redis monitor');

  monitor.on('monitor', (time, args, source, database) => {
    cachelog.verbose('Monitor:', {time, args, source, database});
  });
});

/**
 * Get cache key for a specific dataset
 *
 * Information from Redis documentation about keys:
 * - Very long keys are not a good idea. For instance a key of 1024 bytes is a
 *   bad idea not only memory-wise, but also because the lookup of the key in
 *   the dataset may require several costly key-comparisons. Even when the task
 *   at hand is to match the existence of a large value, hashing it (for example
 *   with SHA1) is a better idea, especially from the perspective of memory and
 *   bandwidth.
 * - Very short keys are often not a good idea. There is little point in writing
 *   "u1000flw" as a key if you can instead write "user:1000:followers".
 *   The latter is more readable and the added space is minor compared to the
 *   space used by the key object itself and the value object. While short keys
 *   will obviously consume a bit less memory, your job is to find the right
 *   balance.
 * - Try to stick with a schema. For instance "object-type:id" is a good idea,
 *   as in "user:1000". Dots or dashes are often used for multi-word fields, as
 *   in "comment:1234:reply.to" or "comment:1234:reply-to". The maximum allowed
 *   key size is 512 MB.
 *
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} modelName Name of the model
 * @param  {object} query     Query params
 * @return {string}           The composed cache key
 */
const getKey = (modelName, query) => {
  const key = `${modelName}:`;

  return key;
};


/**
 * Plugin to use with Mongoose. This plugin will write data to the Redis cache,
 * and read the data and make an early return to avoid hitting MongoDB.
 *
 * The schema.pre('find') works when populating documents since populate() is a
 * sugarcoating for find(). This means we can populate documents and dont worry
 * about caching since the sub-document is responsible for it.
 *
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Mongoose.Schema} schema  Mongoose schema to apply to
 * @param  {object}          options Plugin options (see Mongoose docs).
 * @return {void}
 */
const cache = (schema, options) => {

  /**
   * Use `function` instead of ES6 arrow function to be able to reach the scope
   * `this`. This gets run before querying MongoDB (triggered by find()).
   */
  schema.pre('find', function() {
    cachelog.verbose(`PRE FIND for ${this.model.modelName}`);
  });

  /**
   * Todo implement cache control for more of the mongoose events
   * - find (get)
   * - save (add)
   * - exec (?)
   * - update (replace)
   * - delete (invalidate)
   * - ...
   * etc
   */

  schema.post('save', function(doc, next) {
    cachelog.verbose(`Saving doc to cache key ${doc._id}`, doc.toObject());
    redis.set(doc._id, JSON.stringify(doc.toObject()));
    next();
  });
};

module.exports = cache;
