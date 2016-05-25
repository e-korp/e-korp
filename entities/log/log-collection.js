const Collection = require('../../lib/collection');
const LogModel = require('./log-model');
const Log = require('./log-resource');

const applog = require('winston').loggers.get('applog');

class LogCollection extends Collection {

  constructor() {
    super();
  }

  /**
   * Query for logging entries, we dont use any caching here since logging is
   * used in development and not for public use. It will not load more than 100
   * records
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @todo add caching
   * @param  {array}  levels    The logging levels to query on
   * @param  {Date}   dateFrom  Date range start
   * @param  {Date}   dateTo    Date range stop
   * @param  {string} order     In which order to sort, defaults to DESC
   * @return {Promise}          List of log entries
   */
  query(levels = [], dateFrom, dateTo, order = 'desc') {
    return new Promise((resolve, reject) => {
      const query = {};

      // Add filter for levels
      if (levels) {
        query.level = { $in: levels };
      }

      if (dateFrom || dateTo) {
        query.createdAt = {};

        if (dateFrom) {
          query.createdAt.$gte = dateFrom;
        }

        if (dateTo) {
          query.createdAt.$lte = dateTo;
        }
      }

      const sort = { createdAt: order };

      // Use the query to build the cache key
      const cacheKey = this.getCacheKey(
        'Log',
        JSON.stringify(query) + JSON.stringify(sort)
      );

      // Try to get from cache before hitting db
      this.cache.get(cacheKey).then(data => {
        // Found key in cache
        this.map(data);

        return resolve(this.getData());
      }).catch((err) => {
        // Did not find it in cache, load directly from DB instead
        applog.info('Did not find key in cache', err);

        return LogModel
        .find(query)
        .sort(sort)
        .limit(100)
        .exec()
        .then((results) => {
          this.map(results);

          // Add it to the cache
          this.cache.add(cacheKey, this.getData(), ['logs']);
          return resolve(this.getData());
        }).catch((modelError) => {
          return reject(modelError);
        });
      });
    });
  }


  /**
   * Maps raw data into the structure of this object
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {array} entries List of entries
   * @return {void}
   */
  map(entries) {
    for (const entry of entries) {
      const l = new Log();
      l.map(entry);
      this.add(l);
    }
  }

}

module.exports = LogCollection;
