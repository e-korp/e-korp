const Auth = require('../../entities/session/authentication');
const Oops = require('../../lib/oops');

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const applog = require('winston').loggers.get('applog');

/**
 * Authenticates JWT in header
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const authenticateJWT = async((req, res, next) => {
  const token = req.get('X-Access-Token');

  // Check if the token header
  if (!token) {
    applog.verbose('User did not have X-Access-Token header');
    return next(new Oops('Unauthorized', 403, 5002));
  }

  let payload = null;

  try {
    payload = await(Auth.validateJwt(token));
  } catch (err) {
    applog.verbose('User token was invalid');
    return next(new Oops('Unauthorized', 403, 5003, err));
  }

  // Append the payload to the request object for access later on
  req.user = payload;

  next(null, req, res);
});

module.exports = authenticateJWT;
