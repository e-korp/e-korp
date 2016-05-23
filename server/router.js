const router = require('express').Router();

/**
 * Apply middleware
 */
require('./middleware');


/**
 *  Mount routers
 */
// router.use('/categories', require('../entities/category/category-router'));
// router.use('/products', require('../entities/product/product-router'));
router.use('/logs', require('../entities/log/log-router'));

module.exports = router;
