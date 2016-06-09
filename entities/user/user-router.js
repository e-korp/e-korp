const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Models
const User = require('./user-model');
const Authentication = require('../session/authentication');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');

/**
 * Create users (admin route, not for registering)
 * @todo add admin middleware
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res) => {
  // Read input parameters
  let email = null;
  let password = null;
  let role = null;
  let name = null;

  try {
    email = req.body.data.attributes.email;
    password = req.body.data.attributes.password;
    role = req.body.data.attributes.role;
    name = req.body.data.attributes.name;
  } catch (err) {
    return res.oops(new Oops('Required parameters missing', 400, 4001, err));
  }

  // Hash the password
  let hash = null;

  try {
    hash = await(Authentication.generateHash(password));
  } catch (e) {
    return res.oops(new Oops('Could not generate password hash', 500, 5000, e));
  }

  const newUser = new User({
    email: email,
    role: role,
    name: name,
    password: hash,
  });

  // Save the new user
  try {
    await(newUser.save());
  } catch (err) {
    return res.oops(new Oops('Could not save new user', 500, 5000, err));
  }

  applog.info(`Created new user (${newUser.email})`);

  // Write response
  return res.status(201).reply({
    data: {
      type: 'users',
      id: newUser.id,
      attributes: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    },
  });
});


/**
 * Hook up route methods
 */
router.post('/', authMiddleware.admin, create);

module.exports = {
  router: router,
  create: create,
};
