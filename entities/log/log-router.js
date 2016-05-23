const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the resource
const LogCollection = require('./log-collection');
const Log = require('./log-resource');
const Oops = require('../../lib/oops');

const applog = require('winston').loggers.get('applog');

/**
 * Get log entries
 */
router.get('/', async((req, res, next) => {
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 7);
  let levels = [];

  // Try to parse the levels parameter
  try {
    levels = req.query.levels.split(',');
  } catch (e) {
    applog.warn('Invalid level parameter');
    levels = [1];
  }

  // Load data from the DB
  const lc = new LogCollection();

  try {
    await(lc.query(
      levels,
      req.query.dateFrom || defaultFrom,   // Default last week
      req.query.dateTo || new Date(),      // Default now
      req.query.order || 'desc'            // Default latest first
    ));

    res.status(200).json(lc.getData());
  } catch (e) {
    next(new Oops('Could not fetch logs', 5001, e));
  }
}));


/**
 * Add new log entry
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
router.post('/', async((req, res, next) => {
  try {
    const l = new Log();
    l.description = req.body.description;
    l.title = req.body.title;
    l.stackTrace = req.body.stackTrace;
    l.data = req.body.data;
    l.level = req.body.level;

    await(l.save());
    res.status(201).json(l.getData());
  } catch (e) {
    next(new Oops('Could not add log entry', 5000, e));
  }
}));

module.exports = router;
