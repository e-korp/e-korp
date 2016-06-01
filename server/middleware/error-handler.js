const applog = require('winston').loggers.get('applog');

/**
 * Collects any errors from the routes and handles them properly
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Oops}     oops  An oops error from the routes
 * @param  {Request}  req   Express request object
 * @param  {Response} res   Express response object
 * @param  {Function} next  Next middleware function
 * @return {void}
 */
module.exports = (oops, req, res, next) => {
  next(oops, req, res, next);

  if (oops) {
    applog.error(oops);

    res.status(oops.httpCode || 500);
    return res.json({
      errors: [{
        status: `${oops.httpCode}`,
        code: `${oops.code}`,
        title: oops.message,
        meta: oops.error
      }],
    });
  }

  return next(req, res, next);
};
