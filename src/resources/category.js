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
    const cacheKey = 'categoryList';

    console.log('snopp');

    // Look for the result in the cache
    if (this.cache.exists(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const categoryData = [
      {
        name: 'Category 1sdsd',
      },
      {
        name: 'Category 2',
      },
    ];

    this.cache.add(cacheKey, categoryData, ['category'], 60);

    return categoryData;
  }

}

module.exports = new Category();
