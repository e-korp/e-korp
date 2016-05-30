/**
 * API app setup
 */

const bodyParser = require('body-parser');
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
 * Setup cache
 */
// TODO: Setup Redis cache and monitoring here


/**
* Middleware for parsing JSON bodies
*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}));


/**
 * Attach routes
 */
app.use('/', require('./router'));


/**
 * Catch any error in the routes
 */
app.use(require('./middleware/error-handler'));



/**
 * Start listening
 */
applog.info(`Server listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);
