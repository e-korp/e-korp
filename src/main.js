/**
 * Application entry point
 */


/**
 *  Setup environment variables
 */
const envir = require('./environment');

// Apply fallback values for environment variables
envir.applyFallback();


/**
 * Initiate the logging
 */
require('./logging');

const winston = require('winston');
const applog = winston.loggers.get('applog');


/**
 * Setup database connection
 */
require('./database');


/**
 * Create required directories
 */
applog.info('Creating required directories');
const mkdirp = require('mkdirp');
mkdirp('logs');


/**
 * Setup internal cache
 */
applog.info('Setting up internal cache');
const cache = require('./lib/cache');

cache.setup(
  './cache',  // Directory to store cache files
  600         // Invalidate interval (seconds)
);


/**
 * Setup currency monitoring
 */
applog.info('Setting up currency conversion');
const cc = require('./lib/currency-converter');

// Run the watcher
cc.run();

require('./server');
