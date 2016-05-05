
/**
 * General resource class for handling caching calls etc.
 * The resource class of each enitity separates the data-layer (mongodb, cache)
 * from the controller layer (koa router)
 */

const cache = require('../lib/cache');
const md5 = require('md5');

class Resource {

  constructor() {
    // Holds cache singleton
    this._cache = cache;
  }

  /**
   * Creates hash key for entities
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} entityIdentifier Identifier for which method
   * @return {string}                  32 char long MD5 hash
   */
  getCacheKey(entityIdentifier) {
    return md5(__dirname + __filename + entityIdentifier);
  }

  /**
   * Getters and setters
   */

  get cache() {
    return this._cache;
  }

}

module.exports = Resource;
