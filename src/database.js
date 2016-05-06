const mongoose = require('mongoose');
const winston = require('winston');
const applog = winston.loggers.get('applog');

/**
 * Setup database connection
 */

mongoose.connection.on('open', () => {
  applog.info('Database connection opened successfully');
});

mongoose.connection.on('error', (err) => {
  applog.error('Database connection failed', err);
});

mongoose.connect(process.env.MONGO_URI);
