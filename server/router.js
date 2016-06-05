const router = require('express').Router();
const applog = require('winston').loggers.get('applog');

/**
 *  Mount routers
 */
applog.verbose('Mounting routers');

router.use('/users', require('../entities/user/user-router'));
router.use('/sessions', require('../entities/session/session-router'));
router.use('/logs', require('../entities/log/log-router'));
router.use('/watchers', require('../entities/watcher/watcher-router'));
router.use('/categories', require('../entities/category/category-router'));

module.exports = router;
