const applog = require('winston').loggers.get('applog');

/**
 * Collects all requests that didnt match any route
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Request}    req  Express request object
 * @param  {Response}   res  Express response object
 * @return {void}
 */
module.exports = (req, res) => {
  return res.status(404).json({
    errors: [{
      status: '404',
      title: 'The resource could not be found'
    }],
  });
};
