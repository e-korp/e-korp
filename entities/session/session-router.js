const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Models
const User = require('../user/user-model');
const Auth = require('./authentication');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');


/**
 * Create 'sessions'
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res, next) => {
  // Read input parameters
  let email = null;
  let password = null;

  try {
    email = req.body.attributes.email;
    password = req.body.attributes.password;
  } catch (err) {
    return next(new Oops('Required parameters is missing', 4001, err));
  }

  // Try to get the user by email address
  let user = null;

  try {
    user = await(
      User
        .find({email: email})
        .select('+password')
        .exec()
    )[0];
  } catch (err) {
    return next(new Oops('Could not create session', 5001, err));
  }

  // No user was found for the email
  if (Object.keys(user).length === 0) {
    return next(new Oops('Invalid authentication credentials', 5002));
  }

  // A user was found, compare the password hash
  let passwordMatch = false;

  try {
    passwordMatch = await(Auth.compareHash(user.password, password));
  } catch (err) {
    return next(new Oops('Invalid authentication credentials', 5003, err));
  }

  if (!passwordMatch) {
    return next(new Oops('Could not create session', 5004));
  }

  // Generate a new JWT for the client
  let token = null;

  try {
    token = await(Auth.generateJwt(Auth.userPayload(user)));
  } catch (err) {
    return next(new Oops('Could not generate token', 5005, err));
  }

  applog.info(`User '${user.email}' logged in successfully using token auth`);

  // Write response
  return res.status(201).json({
    data: {
      type: 'sessions',
      id: 1,
      attributes: {
        jwt: token,
      },
      relationships: {
        user: {
          data: {
            type: 'user',
            id: user.id,
            attributes: {
              email: user.email,
              name: user.name,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          },
        },
      },
    },
  });

});


/**
 * Hook up route methods
 */
router.post('/', create);

module.exports = router;
