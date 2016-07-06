const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const Log = require('./log-model');

// Error handling and logging
const Oops = require('../../lib/oops');
// const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');


/**
 * Add new log entry
 * @todo append the issuer to the logging object
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res) => {
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

  // Try to save it
  try {
    await(log.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.oops(
        new Oops(
          'Couldnt add log entry: ' + JSON.stringify(err),
          500,
          6001,
          err
        )
      );
    }

    return res.oops(new Oops('Could not add log entry', 500, 6001, err));
  }

  return res.status(201).reply({
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
  });
});


/**
 * Get log entries
 * @todo pagination
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const get = async((req, res) => {
  let entries = [];

  // Query for logs
  try {
    entries = await(
      Log
      .find({})
      .sort({createdAt: -1})
      .limit(100)
      .exec()
    );
  } catch (err) {
    return res.oops(new Oops('Could not get entries', 500, 6002));
  }

  // Construct the return data
  const responseData = [];

  for (const log of entries) {
    responseData.push({
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
    });
  }

  return res.status(200).reply(responseData);
});


/**
 * Hook up to router
 */
router.post('/', create);
router.get('/', authMiddleware.admin, get);

module.exports = {
  router: router,
  create: create,
  get: get
};
