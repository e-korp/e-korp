const userRoles = require('../../entities/user/user-roles');
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
    return res.oops(new Oops('Unauthorized', 403, 5006));
  }

  let payload = null;

  try {
    payload = await(Auth.validateJwt(token));
  } catch (err) {
    applog.verbose('User token was invalid');
    return res.oops(new Oops('Unauthorized', 403, 5007, err));
  }

  // Append the payload to the request object for access later on
  req.user = payload;

  next();
});

/**
 * Makes sure the requester is a logged in admin
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const admin = async((req, res, next) => {
  authenticateJWT(req, res, () => {
    let role = null;

    try {
      role = req.user.role;
    } catch (err) {
      return next(new Oops('Unauthorized', 403, 5100, err));
    }

    if (role !== userRoles.ROLES.ADMIN) {
      return next(new Oops('Unauthorized', 403, 5101));
    }

    return next();
  });
});

module.exports = {
  admin: admin,
  authenticated: authenticateJWT,
};
