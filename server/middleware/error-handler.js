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

    const meta = process.env.NODE_ENV === 'development' ? oops.error : null;

    res.status(oops.httpCode || 500);
    return res.json({
      errors: [{
        status: `${oops.httpCode || 500}`,
        code: `${oops.code}`,
        title: oops.message,
        meta: meta
      }],
    });
  }

  return next(req, res, next);
};
