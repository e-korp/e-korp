const Collection = require('../../lib/collection');

const Product = require('./product-resource');
const ProductModel = require('./product-model');

class ProductCollection extends Collection {

  constructor() {
    super();
  }


  getAll() {
    return new Promise((resolve, reject) => {
      const cacheKey = this.getCacheKey('ProductCollection', 'all');

      // Check if the result exists in the cache
      this.cache.get(cacheKey).then((data) => {
        for (const rawProduct in data) {
          const p = new Product();
          p.map(rawProduct);
          this.add(p);

          // TODO: Cache every individual product in the list here
          resolve(this.items);
        }
      }).catch((err) => {
        // The data was not found in the cache load it from the model
        return ProductModel.find({}).exec().then((results) => {
          this.cache.add(cacheKey, results, ['product', 'product-collection']);

          for (const rawProduct in results) {
            const p = new Product();
            p.map(rawProduct);
            this.add(p);
          }

          resolve(this.items);
        }).catch((modelErr) => {
          reject(modelErr);
        });
      });
    });
  }


  /**
   * General querying for products
   * @todo test this
   */
  query(text, categories = [], from = 0, limit = 20) {

    const query = {
      text: text,
    };

    // Build the cache key for this particular query
    const cacheKey = this.getCacheKey('ProductCollection', {
      text: text,
      categories: categories,
      from: from,
      limit: limit,
    });

    // Check if the result exists in the cache
    this.cache.get(cacheKey).then((data) => {
      for (const rawProduct in data) {
        const p = new Product();
        p.map(rawProduct);
        this.add(p);
      }
    }).catch((err) => {
      // The data was not found in the cache load it from the model
      return ProductModel.find({/* ... */}).exec().then((results) => {
        this.cache.add(cacheKey, results, ['product', 'product-collection']);

        for (const rawProduct in results) {
          const p = new Product();
          p.map(rawProduct);
          this.add(p);
        }

        return true;
      });
    });
  }


  /**
   * Load products by IDs into this collection
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {array} productIds  Array of product ids
   * @return {Promise}           Number of loaded products on success, error on
   *                             failure
   */
  findByIds(productIds) {
    // TODO: Check if we already got some products to load from the cache
    return new Promise((resolve, reject) => {
      // TODO: Real mongo query
      this._model.find({$in: [productIds]}).exec().then((products) => {
        for (const rawProduct in products) {
          let p = new Product();
          p.map(rawProduct);
          this.add(p);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Getters and setters
   */

  get model() {
    return this._model;
  }

  set model(model) {
    this._model = model;
  }

}

module.exports = ProductCollection;
