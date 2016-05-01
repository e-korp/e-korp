const Resource = require('./resource');

class Category extends Resource {

  constructor() {
    super();
  }

  /**
   * Gets category tree
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {integer} level     The level to start on
   * @param  {integer} maxDepth  Number of levels to go down
   * @return {object}            Nested tree strucure of categories
   */
  getCategoryTree(level = 0, maxDepth = 100) {
    return {};
  }


  /**
   * Example method for testing
   * @TODO remove this
   * @author Johan Kanefur <johan.canefur@gmail.com>
   */
  getCategoryList() {
    return [
      {
        name: 'Category 1',
      },
      {
        name: 'Category 2',
      },
    ];
  }

}

module.exports = new Category();
