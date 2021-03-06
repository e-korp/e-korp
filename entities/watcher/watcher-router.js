const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the model
const Watcher = require('./watcher-model');
const Log = require('../log/log-model');

// Error handling and logging
const Oops = require('../../lib/oops');
// const applog = require('winston').loggers.get('applog');

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
    return res.oops(new Oops('Could not get watchers', 500, 7001, err));
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
          pgKey: watcher.pgKey,
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
    watcher = await(Watcher.findOne({id: req.params.id}).exec());
  } catch (err) {
    return res.oops(new Oops('Could not get watcher', 500, 7002, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not get watcher', 404, 7003));
  }

  const responseData = {
    data: {
      type: 'watcher',
      id: watcher.id,
      attributes: {
        name: watcher.name,
        description: watcher.description,
        state: watcher.state,
        pgKey: watcher.pgKey,
        updatedAt: watcher.updatedAt,
        createdAt: watcher.createdAt,
      },
      logs: {
        data: watcher.logs.map(log => {
          return {
            type: 'log',
            id: log
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
  let name = null;
  let description = null;
  let pgKey = null;
  let id = null;

  try {
    name = req.body.data.attributes.name;
    description = req.body.data.attributes.description;
    pgKey = req.body.data.attributes.pgKey;
    id = req.body.data.attributes.id;
  } catch (err) {
    return res.oops(new Oops('Required parameters is missing', 400, 4001, err));
  }

  const watcher = new Watcher({
    name: name,
    description: description,
    pgKey: pgKey,
    id: id
  });

  try {
    await(watcher.save());
  } catch (err) {
    if (err.code === 11000) {
      return res.oops(
        new Oops('Watcher with ID already exists', 409, 7004, err)
      );
    }

    return res.oops(new Oops('Could not add watcher', 500, 7005, err));
  }

  const responseData = {
    data: {
      type: 'watcher',
      id: watcher.id,
      attributes: {
        name: watcher.name,
        description: watcher.description,
        state: watcher.state,
        pgKey: watcher.pgKey,
        updatedAt: watcher.updatedAt,
        createdAt: watcher.createdAt
      }
    }
  };

  res.status(201).reply(responseData);
});

/**
 * Update specific watcher
 * @todo we can broadcast state changes with socketio here
 * @todo add integration with pagerduty here
 */
const update = async((req, res) => {
  let watcher = null;

  try {
    watcher = await(Watcher.findOne({id: req.params.id}));
  } catch (err) {
    return res.oops(new Oops('Could not get watcher', 500, 7002, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not get watcher', 404, 7003));
  }

  // Gather attributes
  let state = null;
  let name = null;
  let description = null;
  let pgKey = null;

  try {
    state = req.body.data.attributes.state;
    name = req.body.data.attributes.name;
    description = req.body.data.attributes.description;
    pgKey = req.body.data.attributes.pgKey;
  } catch (err) {
    return res.oops(new Oops('Required parameters is missing', 400, 4001, err));
  }

  // Change values if provided
  watcher.name = name || watcher.name;
  watcher.description = description || watcher.description;
  watcher.pgKey = pgKey || watcher.pgKey;
  watcher.state = (state !== null && typeof state !== 'undefined') ?
    state : watcher.state;

  try {
    await(watcher.save());
  } catch (err) {
    return res.oops(new Oops('Could not update watcher', 500, 7006, err));
  }

  const responseData = {
    data: {
      type: 'watchers',
      id: watcher.id,
      attributes: {
        name: watcher.name,
        description: watcher.description,
        state: watcher.state,
        pgKey: watcher.pgKey,
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
    watcher = await(
      Watcher
      .findOne({id: req.params.id})
      .populate('logs')
      .exec()
    );
  } catch (err) {
    return res.oops(new Oops('Could not get watcher', 500, 7002, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not get watcher', 404, 7003));
  }

  const responseData = watcher.logs.map(log => {
    return {
      data: {
        type: 'logs',
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
    watcher = await(Watcher.findOne({id: req.params.id}).exec());
  } catch (err) {
    return res.oops(new Oops('Could not get watcher', 500, 7002, err));
  }

  if (!watcher) {
    return res.oops(new Oops('Could not get watcher', 404, 7003));
  }

  // Try to construct the new logging object
  let log = null;

  try {
    log = new Log({
      title: req.body.data.attributes.title,
      description: req.body.data.attributes.description,
      stackTrace: req.body.data.attributes.stackTrace || {},
      level: req.body.data.attributes.level,
      data: req.body.data.attributes.data,
    });
  } catch (err) {
    return res.oops(new Oops('Required parameters missing', 400, 4001, err));
  }

  // Save the log
  try {
    await(log.save());
  } catch (err) {
    return res.oops(new Oops('Could not save log', 500, 6003, err));
  }

  // Append the log
  watcher.logs.push(log._id);

  try {
    await(watcher.save());
  } catch (err) {
    return res.oops(new Oops('Could not update watcher', 500, 7006, err));
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

module.exports = {
  router: router,
  get: get,
  getSpecific: getSpecific,
  add: add,
  update: update,
  getSpecificLogs: getSpecificLogs,
  createSpecificLogs: createSpecificLogs
};
