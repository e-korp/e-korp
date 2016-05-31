const applog = require('winston').loggers.get('applog');

/**
 * Collects any errors from the routes and handles them properly
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @returns void
 */
module.exports = (oops, req, res, next) => {
  next(oops, req, res, next);

  if (oops) {
    applog.error(oops);

    res.status(oops.httpCode || 500);
    res.json({
      error: {
        message: oops.message,
        code: oops.code,
        err: oops.error,
      },
    });
  }
};
