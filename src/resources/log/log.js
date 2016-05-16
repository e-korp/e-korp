const Resource = require('../resource');
const LogModel = require('../../models/log');

class Log extends Resource {

  constructor() {
    super();

    this._message = null;
    this._data = {};
    this._level = null;
    this._createdAt = null;
    this._updatedAt = null;
    this._id = null;
  }


  /**
   * Saves this log
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {Promise}  Save promise from mongoose
   */
  save() {
    return new Promise((resolve, reject) => {
      const log = new LogModel({
        message: this._message,
        data: this._data,
        level: this._level,
      });

      return log.save().then(() => {
        this._createdAt = log.createdAt;
        this._updatedAt = log.updatedAt;
        this._id = log.id;
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }


  /**
   * Load a specific log entry by ID
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} id ID to fetch
   * @return {void}
   */
  load(id) {
    return new Promise((resolve, reject) => {
      const cacheKey = this.getCacheKey('Log', id);

      // Check if the result exists in the cache
      this.cache.get(cacheKey).then((data) => {
        return resolve(data);
      }).catch((err) => {
        // The data was not found in the cache load it from the model
        return LogModel.findOne({id: id}).exec().then((result) => {
          this.cache.add(cacheKey, result, ['log']);
          return resolve(result);
        }).catch((modelErr) => {
          reject(modelErr);
        });
      });
    });
  }


  /**
   * Map raw data into this object (from the model)
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {object} data The data to map (from the model)
   * @return {void}
   */
  map(data) {
    this._message = data.message;
    this._data = data.data;
    this._level = data.level;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._id = data.id;
  }


  /**
   * Returns this object in clean object format
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {object} Log object
   */
  getData() {
    return {
      message: this._message,
      data: this._data,
      level: this._level,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      id: this._id,
    };
  }


  /**
   * Getters and setters
   */

  get message() {
    return this._message;
  }

  set message(message) {
    this._message = message;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  get level() {
    return this._level;
  }

  set level(level) {
    this._level = level;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(createdAt) {
    this._createdAt = createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(updatedAt) {
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

}

module.exports = Log;
