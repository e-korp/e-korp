/**
 * Collects all requests that didnt match any route
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Error}      err   Error from middleware before
 * @param  {Request}    req   Express request object
 * @param  {Response}   res   Express response object
 * @param  {Function}   next  Function to next middleware
 * @return {void}
 */
module.exports = (err, req, res, next) => {
  if (err) {
    return res.status(422).json({
      errors: [{
        status: '422',
        title: 'Invalid request'
      }],
    });
  }

  next();
};
