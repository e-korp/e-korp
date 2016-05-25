const router = require('express').Router();
const applog = require('winston').loggers.get('applog');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * Apply middleware
 */
applog.verbose('Adding routing middleware');
router.use(require('./middleware/error-handler'));
router.use(morgan('dev'));


/**
 * Setup access log
 */
 // Always log to file
router.use(morgan('common', {
  stream: fs.createWriteStream(path.join('logs', 'access.log'), {
    flags: 'a',
  }),
}));

// Log to console in dev mode
if (process.env.NODE_ENV === 'development') {
  router.use(morgan('dev'));
}


/**
 *  Mount routers
 */
applog.verbose('Mounting routers');
// router.use('/categories', require('../entities/category/category-router'));
// router.use('/products', require('../entities/product/product-router'));
router.use('/logs', require('../entities/log/log-router'));
router.use('/watchers', require('../entities/watcher/watcher-router'));


module.exports = router;
