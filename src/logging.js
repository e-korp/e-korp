/**
 * Setup logging
 * We use winston for logging:
 * https://github.com/winstonjs/winston#working-with-multiple-loggers-in-winston
 */
const winston = require('winston');

// Configure logger for background tasks
winston.loggers.add('tasklog', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'Background tasks',
  },
  file: {
    filename: './logs/bgtasks.log',
  },
});

// Configure the logger for general use
winston.loggers.add('applog', {
  console: {
    level: 'info',
    colorize: true,
    label: 'Application log',
  },
  file: {
    filename: './logs/app.log',
  },
});

// Configure the access logger
winston.loggers.add('accesslog', {
  console: {
    level: 'info',
    colorize: true,
    label: 'Access log',
  },
  file: {
    level: 'info',
    filename: './logs/access.log',
  },
});

// Report in that the logging is working
const applog = winston.loggers.get('applog');
applog.info('Logging setup successfully');
