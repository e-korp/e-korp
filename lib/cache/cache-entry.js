class CacheEntry {

  constructor(key, data, tags = [], ttl) {
    this._key = key;
    this._data = data;
    this._tags = tags;
    this._ttl = ttl;
    this._date = new Date().getTime() / 1000;
  }

  /**
   * Getters and setters
   */

  get key() {
    return this._key;
  }

  set key(key) {
    this._key = key;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

  get tags() {
    return this._tags;
  }

  set tags(tags) {
    this._tags = tags;
  }

  get ttl() {
    return this._ttl;
  }

  set ttl(ttl) {
    this._ttl = ttl;
  }
}

module.exports = CacheEntry;
