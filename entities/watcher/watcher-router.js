const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the model
const Watcher = require('./watcher-model');
const Log = require('../log/log-model');
const states = require('./states');

// Use pager duty for alarms
const PagerDuty = require('pagerduty');
const pager = new PagerDuty({
  serviceKey: '12345678901234567890123456789012',
});

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');

/**
 * Get list of all watchers entries
 */

const get = async((req, res) => {
  let watchers = [];

  try {
    watchers = await(Watcher.find({}).exec());
  } catch (err) {
    return res.oops(new Oops('Could not get watchers', 500, 5000, err));
  }

  const responseData = [];

  for (const watcher of watchers) {
    responseData.push({
      data: {
        type: 'watcher',
        id: watcher.id,
        attributes: {
          name: watcher.name,
          description: watcher.description,
          state: watcher.state,
          updatedAt: watcher.updatedAt,
          createdAt: watcher.createdAt
        }
      }
    });
  }

  res.status(200).reply(responseData);
});

/**
 * Get specific watcher
 */
const getSpecific = async((req, res) => {
  let watcher = null;

  try {
    watcher = await(Watcher.findOne(req.params.id).populate('logs').exec());
  } catch (err) {
    return res.oops(new Oops('Could not find watcher', 500, 5000, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not find watcher', 404, 5000));
  }

  const responseData = {
    data: {
      type: 'watcher',
      id: watcher.id,
      attributes: {
        name: watcher.name,
        description: watcher.description,
        state: watcher.state,
        updatedAt: watcher.updatedAt,
        createdAt: watcher.createdAt,
      },
      logs: {
        data: watcher.logs.map(log => {
          return {
            type: 'log',
            id: log.id
          };
        })
      }
    }
  };

  return res.status(200).reply(responseData);
});


/**
 * Add new watcher
 */
const add = async((req, res) => {
  try {
    const watcher = new Watcher({
      name: req.body.attributes.name,
      description: req.body.attributes.description,
      id: req.body.attributes.id
    });

    await(watcher.save());

    const responseData = {
      data: {
        type: 'watcher',
        id: watcher.id,
        attributes: {
          name: watcher.name,
          description: watcher.description,
          state: watcher.state,
          updatedAt: watcher.updatedAt,
          createdAt: watcher.createdAt
        }
      }
    };

    res.status(201).reply(responseData);
  } catch (err) {
    if (err.code === 11000) {
      return res.oops(new Oops('Watcher with ID already exists', 409, 5000, err));
    }

    return res.oops(new Oops('Could not add watcher', 500, 5000, err));
  }
});

/**
 * Update specific watcher
 * @todo we can broadcast state changes with socketio here
 * @todo add integration with pagerduty here
 */
const update = async((req, res) => {
  let watcher = null;

  try {
    watcher = await(Watcher.findOne(req.params.id));
  } catch (err) {
    return res.oops(new Oops('Could not find watcher', 500, 5000, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not find watcher', 404, 5000));
  }

  // Gather attributes
  let state = null;
  let name = null;
  let description = null;

  try {
    state = req.body.attributes.state;
    name = req.body.attributes.name;
    description = req.body.attributes.description;
  } catch (err) {
    return res.oops(new Oops('Missing required parameters', 400, 5000, err));
  }

  // Check if the state has changed to trigger alarms
  if (state) {
    if (watcher.state === states.OK && state !== states.OK) {
      // Watcher entered failed state
      applog.info(`Watcher ${watcher.id} entered failed state`);
    }

    if (watcher.state !== states.OK && state === states.OK) {
      // Watcher recovered from failed state
      applog.info(`Watcher ${watcher.id} recovered from fail-state`);
    }
  }

  // Change values if provided
  watcher.name = name || watcher.name;
  watcher.description = description || watcher.description;
  watcher.state = state || watcher.state;

  await(watcher.save());

  const responseData = {
    data: {
      type: 'watcher',
      id: watcher.id,
      attributes: {
        name: watcher.name,
        description: watcher.description,
        state: watcher.state,
        updatedAt: watcher.updatedAt,
        createdAt: watcher.createdAt
      }
    }
  };

  return res.status(200).reply(responseData);
});

/**
 * Get all logs for a specific watcher
 */
const getSpecificLogs = async((req, res) => {
  let watcher = null;

  try {
    watcher = await(Watcher.findOne(req.params.id).populate('logs').exec());
  } catch (err) {
    return res.oops(new Oops('Could not find watcher', 500, 5000, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not find watcher', 404, 5000));
  }

  const responseData = watcher.logs.map(log => {
    return {
      data: {
        type: 'log',
        attributes: {
          title: log.title,
          description: log.description,
          stackTrace: log.stackTrace,
          level: log.level,
          data: log.data
        }
      }
    };
  });

  return res.status(200).reply(responseData);
});

/**
 * Create logs on a watcher
 */
const createSpecificLogs = async((req, res) => {
  let watcher = null;

  try {
    watcher = await(Watcher.findOne(req.params.id).populate('logs').exec());
  } catch (err) {
    return res.oops(new Oops('Could not find watcher', 500, 5000, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not find watcher', 404, 5000));
  }

  // Try to construct the new logging object
  let log = null;

  try {
    log = new Log({
      title: req.body.attributes.title,
      description: req.body.attributes.description,
      stackTrace: req.body.attributes.stackTrace || {},
      level: req.body.attributes.level,
      data: req.body.attributes.data,
    });
  } catch (err) {
    return res.status(400).reply(
      new Oops('Required parameters missing', 400, 4001, err)
    );
  }

  // Save the log
  try {
    await(log.save());
  } catch (err) {
    return res.oops(new Oops('Could not save log', 500, 5000, err));
  }

  // Append the log
  watcher.logs.push(log._id);

  try {
    await(watcher.save());
  } catch (err) {
    return res.oops(new Oops('Could not store log entry', 500, 5000, err));
  }

  const responseData = {
    data: {
      type: 'log',
      id: log.id,
      attributes: {
        title: log.title,
        description: log.description,
        stackTrace: log.stackTrace,
        level: log.level,
        data: log.data,
      },
    },
  };

  return res.status(200).reply(responseData);
});

// Setup methods to router and apply middleware
router.get('/', authMiddleware.admin, get);
router.get('/:id', authMiddleware.admin, getSpecific);
router.post('/', authMiddleware.admin, add);
router.post('/:id', authMiddleware.admin, update);
router.get('/:id/logs', authMiddleware.admin, getSpecificLogs);
router.post('/:id/logs', authMiddleware.admin, createSpecificLogs);

module.exports = router;
