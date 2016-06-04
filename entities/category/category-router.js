const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const Category = require('./category-model');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');


/**
 * Create a new category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res, next) => {
  
});



/**
 * Gets all categories that exists
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const getAll = async((req, res, next) => {


});


router.post('/', authMiddleware.admin, create);
router.get('/', getAll);

module.exports = router;
