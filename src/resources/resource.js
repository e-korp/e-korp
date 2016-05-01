
/**
 * General resource class for handling caching calls etc.
 * The resource class of each enitity separates the data-layer (mongodb, cache)
 * from the controller layer (koa router)
 */

const cache = require('../lib/cache');

class Resource {

  constructor() {

    // Holds cache singleton
    this._cache = cache;
  }

  getCacheKey(caller) {
    return __dirname + __filename + caller;
  }

  /**
   * Getters and setters
   */

  get cache() {
    return this._cache;
  }

}

module.exports = Resource;
