const router = require('express').Router();
const applog = require('winston').loggers.get('applog');


/**
 * Modify express behavior
 */
applog.verbose('Applying Express extensions/modfications');
require('./express');

/**
 * Apply middleware
 */
applog.verbose('Adding routing middleware');
require('./middleware');

/**
 *  Mount routers
 */
applog.verbose('Mounting routers');
// router.use('/categories', require('../entities/category/category-router'));
// router.use('/products', require('../entities/product/product-router'));
router.use('/logs', require('../entities/log/log-router'));

module.exports = router;
