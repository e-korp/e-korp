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

let invalidationWatcherId;

/**
 * Keeps the cache clean by removing expired entries
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {interger} interval How often to clean the cache (seconds)
 * @return {void}
 */
const startInvalidationWatcher = (interval) => {
  invalidationWatcherId = setInterval(() => {
    //

    tasklog.info('Running cache invalidation');
  }, interval * 1000);
};


/**
 * Stops the invalidation watcher
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const stopInvalidationWatcher = () => {
  clearInterval(invalidationWatcherId);
};


/**
 * Sets up the configuration and starts the invalidation watcher
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}  storedir            Directory to use for cache files
 * @param  {integer} interval            The check interval time to delete
 *                                       old cache entries
 * @return {void}
 */
const setup = (storedir = './', interval = 60) => {
  cachedir = storedir;
  invalidateInterval = interval;

  // Create the caching direcory if it doesnt exist
  mkdirp(cachedir, (err) => {
    if (err) {
      tasklog.error(err);
    }
  });

  // Run the checker
  startInvalidationWatcher(invalidateInterval);
};


/**
 * Adds an cache entry to the cache store
 * @todo Overwrite existing key??
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}  key  Key to identify the cache entry
 * @param  {mixed}   data The data to store in the cache entry
 * @param  {array}   tags Tags associated with the cache entry
 * @param  {integer} ttl  Seconds before the entry gets invalid
 * @return {Promise}      True on success
 */
const add = (key, data, tags = ['global'], ttl = 3600) => {
  return new Promise((resolve) => {
    tasklog.info('Adding to cache');
    cacheStore[key] = new CacheEntry(key, data, tags, ttl);
    resolve(true);
  });
};


/**
 * Checks wheter or not the key exists in the cache
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} key The key to lookup
 * @return {Promise}    True if the key exists, false otherwise
 */
const exists = (key) => {
  return new Promise((resolve) => {
    resolve(key in cacheStore);
  });
};


/**
 * Gets a cache entry by key
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} key The key to get data for
 * @return {Promise}      Data stored in the entry
 */
const get = (key) => {
  return new Promise((resolve, reject) => {
    if (key in cacheStore) {
      tasklog.info('Fetching from cache');

      return resolve(cacheStore[key].data);
    }

    return reject(new Error('Key not found in cache'));
  });
};


/**
 * Clear the cache for a tag
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} tag  The tag to clear
 * @return {Promise}     Number of entries that got removed
 */
const invalidateByTag = (tag) => {
  return new Promise((resolve) => {
    let removedEntries = 0;

    for (const key in cacheStore) {
      // Check if the tags exists
      if (cacheStore[key].tags.indexOf(tag) !== -1) {
        // The tag exists, remove this entry from cache store
        delete cacheStore[key];
        removedEntries = removedEntries + 1;
      }
    }

    return resolve(removedEntries);
  });
};


/**
 * Gets all cache entries with a specific tag
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} tag The tag to find entries for
 * @return {Promise}      List of cache entries matching the tag
 */
const getEntriesByTag = (tag) => {
  return new Promise((resolve) => {
    const foundEntries = [];

    for (const key in cacheStore) {
      if (cacheStore[key].tags.indexOf(tag) !== -1) {
        foundEntries.push(cacheStore[key]);
      }
    }

    resolve(foundEntries);
  });
};


/**
 * Exports the current cache store data
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {Promise}  The current cache store
 */
const exportStore = () => {
  return new Promise((resolve) => {
    resolve(cacheStore);
  });
};


/**
 * Sets the cache store
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {object} store   The data object to set
 * @return {Promise}        -
 */
const importStore = (store) => {
  return new Promise((resolve) => {
    cacheStore = store;
    resolve();
  });
};


module.exports = {
  setup: setup,
  add: add,
  exists: exists,
  get: get,
  startInvalidationWatcher: startInvalidationWatcher,
  stopInvalidationWatcher: stopInvalidationWatcher,
  invalidateByTag: invalidateByTag,
  getEntriesByTag: getEntriesByTag,
  exportStore: exportStore,
  importStore: importStore,
};
