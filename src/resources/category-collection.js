const Collection = require('./collection');
const CategoryModel = require('../models/category').model;

class CategoryCollection extends Collection {

  constructor() {
    super();
  }

  /**
   * Gets all the categories
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {array}  List of all categories
   */
  getAll() {
    const cacheKey = this.getCacheKey('CategoryCollection', 'all');

    return this.cache.get(cacheKey).then((data) => {
      return data;
    }).catch((err) => {
      // Get the data from the model
      return CategoryModel.find({}).then((data) => {
        this.cache.add(cacheKey, data, ['category'], 60);
        return data;
      });
    });
  }

}

module.exports = CategoryCollection;
