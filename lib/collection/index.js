
const Resource = require('../resource');

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
   * Overrides the getData method to gather data from the children instead
   * @returns {array} List of the children data
   */
  getData() {
    return this._items.map(item => {
      return item.getData();
    });
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
