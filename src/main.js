/**
 * Application entry point
 */


/**
 * Setup internal cache
 */

const cache = require('./lib/cache/cache');

cache.setup(
  './cache',  // Directory to store cache files
  10           // Invalidate interval (seconds)
);


require('./server');
