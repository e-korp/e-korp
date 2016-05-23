/**
 * API app setup
 */

const mkdirp = require('mkdirp');
const express = require('express');
const app = express();


/**
 * Initiate the logging
 */
require('./logging');
const applog = require('winston').loggers.get('applog');


/**
 * Apply fallback values for environment variables
 */
applog.verbose('Applying fallback environment variables');
require('./environment').applyFallback();


/**
 * Setup database connection
 */
require('../database');


/**
 * Create required directories
 */
applog.info('Creating required directories');
mkdirp('logs');
mkdirp('cache');


/**
 * Setup internal cache
 */
applog.info('Setting up internal cache');
const cache = require('../lib/cache');
const cacheConfig = require('../config/cache');
cache.setup(cacheConfig.dir, cacheConfig.invalidateInterval);


/**
 * Currency monitoring
 */
// applog.info('Setting up currency conversion');
// require('../lib/currency-converter').run();


/**
 * Attach routes
 */
app.use('/', require('./router'));


/**
 * Start listening
 */
applog.info(`Server listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);
