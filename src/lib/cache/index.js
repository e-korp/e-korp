const CacheEntry = require('./cache-entry');
const mkdirp = require('mkdirp'); // To create directories recursivly
const winston = require('winston');
const tasklog = winston.loggers.get('tasklog');

/**
 * Caching module
 *
 * Base functionality:
 * - Cache tags (empty specific tags)
 * - Write memory cache to disk (in background)
 * - Load disk cache on first start
 * - Async getters and setters (no need atm, but with external cache IO later).
 * - Invalidator (time based)
 */

// Contains the cache
let cacheStore = {};
let cachedir;
let invalidateInterval;

/**
 * Keeps the cache clean by removing expired entries
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {interger} interval How often to clean the cache (seconds)
 * @return {void}
 */
const invalidationWatcher = (interval) => {
  setInterval(() => {
    tasklog.info('Running cache invalidation');
  }, interval * 1000);
};


/**
 * Sets up the configuration and starts the invalidation watcher
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}  cachedir            Directory to use for cache files
 * @param  {integer} invalidateInterval  The check interval time to delete
 *                                       old cache entries
 * @return {void}
 */
const setup = (cachedir = './', invalidateInterval = 60) => {
  return new Promise((resolve, reject) => {
    cachedir = cachedir;
    invalidateInterval = invalidateInterval;

    // Create the caching direcory if it doesnt exist
    mkdirp(cachedir, (err) => {
      return reject(err);
    });

    // Run the checker
    invalidationWatcher(invalidateInterval);

    resolve();
  });
};


/**
 * Adds an cache entry to the cache store
 * @todo Overwrite existing key??
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}  key  Key to identify the cache entry
 * @param  {mixed}   data The data to store in the cache entry
 * @param  {array}   tags Tags associated with the cache entry
 * @param  {integer} ttl  Seconds before the entry gets invalid
 * @return {boolean}      True on success
 */
const add = (key, data, tags = ['global'], ttl = 3600) => {
  return new Promise((resolve) => {
    cacheStore[key] = new CacheEntry(key, data, tags, ttl);
    resolve(true);
  });
};


/**
 * Checks wheter or not the key exists in the cache
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} key The key to lookup
 * @return {boolean}    True if the key exists, false otherwise
 */
const exists = (key) => {
  return Promise.resolve(key in cacheStore);
};


/**
 * Gets a cache entry by key
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} key The key to get data for
 * @return {mixed}      Data stored in the entry
 */
const get = (key) => {
  return new Promise((resolve, reject) => {
    if (key in cacheStore) {
      return resolve(cacheStore[key].data);
    }

    return reject(new Error('Key not found in cache'));
  });
};


/**
 * Clear the cache for a tag
 * @todo Implement this
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} tag  The tag to clear
 * @return {integer}     Number of entries that got removed
 */
const invalidateByTag = (tag) => {
  return new Promise((resolve, reject) => {
    resolve(29);
  });
};

/**
 * Gets all cache entries with a specific tag
 * @todo Implement this
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} tag The tag to find entries for
 * @return {array}      List of cache entries matching the tag
 */
const getEntriesByTag = (tag) => {
  return new Promise((resolve, reject) => {
    resolve([]);
  });
};


/**
 * Exports the current cache store data
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {object}  The current cache store
 */
const exportStore = () => {
  return cacheStore;
};


/**
 * Sets the cache store
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {object} store   The data object to set
 * @return {void}
 */
const importStore = (store) => {
  cacheStore = store;
};


module.exports = {
  setup: setup,
  add: add,
  exists: exists,
  get: get,
  invalidateByTag: invalidateByTag,
  getEntriesByTag: getEntriesByTag,
  exportStore: exportStore,
  importStore: importStore,
};
