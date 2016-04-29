/**
 * Application entry point
 */


/**
 * Setup internal cache
 */
console.log('Setting up internal cache');
const cache = require('./lib/cache');

cache.setup(
  './cache',  // Directory to store cache files
  10          // Invalidate interval (seconds)
);


/**
 * Setup currency monitoring
 */
console.log('Setting up currency conversion');
const cc = require('./lib/currency-converter');

// Run the watcher
cc.run();

require('./server');
