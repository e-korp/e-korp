
const Resource = require('./resource');

class Collection extends Resource {

  constructor(items) {
    super();

    // Holds list of items
    this._items = items || [];
  }


  /**
   * Adds an item to the collection
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {mixed} item  Item to add
   * @return {void}
   */
  add(item) {
    this._items.push(item);
  }


  /**
   * Getters and setters
   */

  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
  }

}

module.exports = Collection;
