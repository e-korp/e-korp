const Resource = require('../../lib/resource');
const LogModel = require('./log-model');

class Log extends Resource {

  constructor() {
    super();

    this._description = null;
    this._title = null;
    this._stackTrace = {};
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
        description: this._description,
        title: this._title,
        stackTrace: this._stackTrace,
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
    this._description = data.description;
    this._title = data.title;
    this._stackTrace = data.stackTrace;
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
      description: this._description,
      title: this._title,
      stackTrace: this._stackTrace,
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

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
  }

  get stackTrace() {
    return this._stackTrace;
  }

  set stackTrace(stackTrace) {
    this._stackTrace = stackTrace;
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
