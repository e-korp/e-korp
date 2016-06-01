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

const addr = process.env.EKORPDOCKER_MONGO_1_PORT_27017_TCP_ADDR;
const port = process.env.EKORPDOCKER_MONGO_1_PORT_27017_TCP_PORT;

mongoose.connect(`mongodb://${addr}:${port}/ekorp`);
