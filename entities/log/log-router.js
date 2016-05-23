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
router.post('/', (req, res) => {

  res.error('hejhej');

  console.log(res.status(200));

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

    res.status(400).error('Could not get create log', e);
  }
});

module.exports = router;
