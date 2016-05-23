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
      // Validate the sorting
      if (['asc', 'desc'].indexOf(order) === -1) {
        return reject(new Error('Invalid sorting value'));
      }

      if (!(levels instanceof Array)) {
        return reject(new Error('Levels must be an array'));
      }

      const query = {};


      // Add filter for levels
      if (levels) {
        query.level = {
          $in: levels,
        };
      }

      // Add filter for date ranges
      const useDateFrom = dateFrom instanceof Date;
      const useDateTo = dateTo instanceof Date;

      if (useDateFrom || useDateTo) {
        query.createdAt = {};

        if (useDateFrom) {
          query.createdAt.$gte = dateFrom;
        }

        if (useDateTo) {
          query.createdAt.$lte = dateTo;
        }
      }

      const sort = {
        createdAt: order,
      };

      // Use the query to build the cache key
      const cacheKey = this.getCacheKey(
        'Log',
        JSON.stringify(query) + JSON.stringify(sort)
      );

      // Try to get from cache before hitting db
      this.cache.get(cacheKey).then((data) => {
        // Found key in cache
        return resolve(data);
      }).catch((err) => {
        // Did not find it in cache, load directly from DB instead
        applog.info('Did not find key in cache', err);

        return LogModel
        .find(query)
        .sort(sort)
        .limit(100)
        .exec()
        .then((results) => {
          for (const entry of results) {
            const l = new Log();
            l.map(entry);
            this.add(l);
          }

          // Add it to the cache
          applog.verbose('Adding log collection to cache', cacheKey);
          this.cache.add(cacheKey, this.items);
          return resolve(this.items);
        }).catch((modelError) => {
          return reject(modelError);
        });
      });
    });
  }


  /**
   * Returns the collection in a plain object format
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {array} List in this collection
   */
  getData() {
    return this.items.map((item) => {
      return item.getData();
    });
  }


}

module.exports = LogCollection;
