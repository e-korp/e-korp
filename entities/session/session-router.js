const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Models
const User = require('../user/user-model');
const Auth = require('./authentication');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');

const config = require('../../config/main');

/**
 * Create 'sessions'
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res) => {
  // Read input parameters
  let email = null;
  let password = null;

  try {
    email = req.body.data.attributes.email;
    password = req.body.data.attributes.password;
  } catch (err) {
    return res.oops(new Oops('Required parameters is missing', 400, 4001, err));
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

    if (!user) {
      throw new Error('Could not find user');
    }
  } catch (err) {
    return res.oops(new Oops('Could not create session', 403, 5001, err));
  }

  // A user was found, compare the password hash
  let passwordMatch = false;

  try {
    passwordMatch = await(Auth.compareHash(user.password, password));
  } catch (err) {
    // TODO: Consistency is key
    return res.oops(
      new Oops('Invalid authentication credentials', 403, 5003, err)
    );
  }

  if (!passwordMatch) {
    return res.oops(new Oops('Could not create session', 403, 5004));
  }

  // Generate a new JWT for the client
  let token = null;

  try {
    token = await(Auth.generateJwt(Auth.userPayload(user)));
  } catch (err) {
    return res.oops(new Oops('Could not generate token', 500, 5005, err));
  }

  applog.info(
    `User '${user.email}' logged in successfully using token auth.` +
    ` Valid for ${config.jwtTTL}`
  );

  // Write response
  return res.status(201).reply({
    data: {
      type: 'session',
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

module.exports = {
  router: router,
  create: create
};
