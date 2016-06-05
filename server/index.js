const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

// Initiate the logging
require('./logging');
const applog = require('winston').loggers.get('applog');

// Apply fallback values for environment variables
applog.verbose('Applying fallback environment variables');
require('./environment').applyFallback();

// Setup database connection
require('../database');

// Setup mail sending
require('../email');

// Create required directories
applog.info('Creating required directories');
mkdirp('logs');

// Setup access log
// Always log to file
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join('logs', 'access.log'), {
    flags: 'a',
  }),
}));

// Log to console in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Extend Express framework
require('./express-extend');

// Middleware for parsing JSON bodies
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));

// Handle errors from body-parser
app.use(require('./middleware/body-parser-error-handler'));

// Attach routes
app.use('/', require('./router'));

// Catch any errors from the routes
app.use(require('./middleware/error-handler'));

// Last resort, handle 404
app.use(require('./middleware/notfound-handler'));

// Start listening
applog.info(`Server listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);
