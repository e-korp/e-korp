const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const Candidate = require('./candidate-model');

// Error handling and logging
const Oops = require('../../lib/oops');
// const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');

/**
 * Add new candidate entry
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res) => {
  // Try to construct the new candidate object
  let candidate = null;

  try {
    candidate = new Candidate({
      email: req.body.data.attributes.email,
    });
  } catch (err) {
    return res.oops(new Oops('Required parameters missing', 400, 4001, err));
  }

  // Try to save it
  try {
    await(candidate.save());
  } catch (err) {
    const errorCode = err.code === 11000 ? 8004 : 8001;
    return res.oops(new Oops('Could not add candidate', 500, errorCode, err));
  }

  return res.status(201).reply({
    data: {
      type: 'candidates',
      id: candidate.id,
      attributes: {
        email: candidate.email,
        createdAt: candidate.createdAt
      }
    }
  });
});

/**
 * Get candidate entries
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const get = async((req, res) => {
  let entries = [];

  // Query for candidates
  try {
    entries = await(
      Candidate
      .find({})
      .sort({createdAt: -1})
      .exec()
    );
  } catch (err) {
    return res.oops(new Oops('Could not get candidates', 500, 8002));
  }

  // Construct the return data
  const responseData = [];

  for (const candidate of entries) {
    responseData.push({
      data: {
        type: 'candidates',
        id: candidate.id,
        attributes: {
          email: candidate.email,
          createdAt: candidate.createdAt
        }
      }
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
