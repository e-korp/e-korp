const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Models
const User = require('./user-model');
const Auth = require('../session/authentication');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');


/**
 * Create users (admin route, not for registering)
 * @todo add admin middleware
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res, next) => {
  // Read input parameters
  let email = null;
  let password = null;
  let role = null;
  let name = null;

  try {
    email = req.body.attributes.email;
    password = req.body.attributes.password;
    role = req.body.attributes.role;
    name = req.body.attributes.name;
  } catch (err) {
    return next(new Oops('Required parameters missing', 4001, err));
  }

  // Hash the password
  let hash = null;

  try {
    hash = await(Auth.generateHash(password));
  } catch (err) {
    return next(new Oops('Could not generate password hash', 5000, err));
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
    return next(new Oops('Could not save new user', 5000, err));
  }

  applog.info(`Created new user (${newUser.email})`);

  // Write response
  return res.status(201).json({
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
router.post('/', create);

module.exports = router;
