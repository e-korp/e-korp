const router = require('express').Router();
const applog = require('winston').loggers.get('applog');


/**
 * Apply middleware
 */
applog.verbose('Adding routing middleware');
router.use(require('./middleware/error-handler'));


/**
 *  Mount routers
 */
applog.verbose('Mounting routers');
// router.use('/categories', require('../entities/category/category-router'));
// router.use('/products', require('../entities/product/product-router'));
router.use('/logs', require('../entities/log/log-router'));


module.exports = router;
