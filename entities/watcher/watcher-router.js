const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the model
const Watcher = require('./watcher-model');
const states = require('./states');

// Use pager duty for alarms
const PagerDuty = require('pagerduty');
const pager = new PagerDuty({
  serviceKey: '12345678901234567890123456789012',
});

const Oops = require('../../lib/oops');
const InputParser = require('../../lib/inputparser');

const applog = require('winston').loggers.get('applog');


// TODO: Add authentication middleware on this entire route

/**
 * Get list of all watchers entries
 */
router.get('/', async((req, res, next) => {
  try {
    const watchers = await(Watcher.find({}).exec());
    res.status(200).json(watchers);
  } catch (e) {
    next(new Oops('Could not get watchers', 5001, e));
  }
}));


/**
 * Add new watcher
 */
router.post('/', async((req, res, next) => {
  try {
    const watcher = new Watcher({
      name: req.body.name,
      description: req.body.description,
      id: req.body.id,
    });

    await(watcher.save());
    res.status(201).json(watcher);
  } catch (e) {
    next(new Oops('Could not add watcher', 5000, e));
  }
}));


/**
 * Update specific watcher
 * @todo we can broadcast state changes with socketio here
 * @todo add integration with pagerduty here
 */
router.post('/:id', async((req, res, next) => {
  try {
    const watcher = await(Watcher.findOne({id: req.params.id}));

    if (!watcher) {
      return res.status(404).json(new Oops('Could not find watcher', 5000));
    }

    // Check if the state has changed to trigger alarms
    if (req.body.state) {
      if (watcher.state === states.OK && req.body.state !== states.OK) {
        // Watcher entered failed state
        applog.info(`Watcher '${watcher.name}' (${watcher.id}) entered failed state`);
      }

      if (watcher.state !== states.OK && req.body.state === states.OK) {
        // Watcher recovered from failed state
        applog.info(`Watcher '${watcher.name}' (${watcher.id}) recovered from fail-state`);
      }
    }

    // Change values if provided
    watcher.name = req.body.name || watcher.name;
    watcher.description = req.body.description || watcher.description;
    watcher.state = req.body.state || watcher.state;

    // Append logs if it is passed on
    if (req.body.log) {
      watcher.logs.push(req.body.log);
    }

    await(watcher.save());
    return res.status(200).json(watcher);
  } catch (e) {
    return next(new Oops('Could not update watcher', 5000, e));
  }
}));

module.exports = router;
