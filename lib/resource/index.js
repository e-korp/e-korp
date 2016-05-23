
/**
 * General resource class for handling caching calls etc.
 * The resource class of each enitity separates the data-layer (mongodb, cache)
 * from the controller layer
 */

const cache = require('../cache');
const md5 = require('md5');

class Resource {

  constructor() {
    // Holds cache singleton
    this._cache = cache;
  }

  /**
   * Helper to create cache key for data
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} entityName Name of the entity
   * @param  {mixed}  query      Parameters used to get the data
   * @return {string}            32 char key
   */
  getCacheKey(entityName, query) {
    if (typeof entityName === 'undefined' || typeof query === 'undefined') {
      throw new Error('Parameters missing');
    }

    return md5(entityName.toLowerCase() + query);
  }

  /**
   * Returns a plain data object representation of this object
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {object} Resulting object
   */
  getData() {
    return {};
  }

  /**
   * Getters and setters
   */

  get cache() {
    return this._cache;
  }

}

module.exports = Resource;
