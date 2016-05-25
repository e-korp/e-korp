const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the resource
const LogCollection = require('./log-collection');
const Log = require('./log-resource');

const Oops = require('../../lib/oops');
const InputParser = require('../../lib/inputparser');

const applog = require('winston').loggers.get('applog');

/**
 * Get log entries
 */
router.get('/', async((req, res, next) => {
  const levels = InputParser.queryList(req.query.levels);
  const range = InputParser.dateRange(req.query.dateFrom, req.query.dateTo);

  const lc = new LogCollection();

  try {
    await(lc.query(
      levels ? levels.length > 0 : [1, 2, 3, 4, 5, 6],
      range[0],                          // Defaults to beginning of time
      range[1],                          // Defaults to future
      InputParser.order(req.query.order) // Defaults to desc
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
