const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the resource
const LogCollection = require('./log-collection');
const Log = require('./log-resource');

const applog = require('winston').loggers.get('applog');

/**
 * Get logs
 */
router.get('/', async((req, res) => {
  const lc = new LogCollection();
  let levels = [];

  try {
    levels = this.request.query.levels.split(',');
  } catch (e) {
    applog.warn('Invalid level parameter');
    levels = [1];
  }

  try {
    await(lc.query(
      levels,
      this.params.dateFrom,
      this.params.dateTo,
      this.params.order
    ));

    res.status(200).json(lc.getData());
  } catch (e) {
    res.status(400).json({
      error: {
        message: 'Could not fetch logs',
      },
    });
  }
}));


/**
 * Add new log entry
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
router.post('/', async((req, res) => {
  applog.info(req.body);

  try {
    const l = new Log();
    l.description = this.request.body.description;
    l.title = this.request.body.title;
    l.stackTrace = this.request.body.stackTrace;
    l.data = this.request.body.data;
    l.level = this.request.body.level;

    await(l.save());

    res.status(201).json(l.getData());
  } catch (e) {
    res.status(400).error('Could not get create log', e);
  }
}));

module.exports = router;
