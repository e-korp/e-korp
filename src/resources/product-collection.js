const Resource = require('./resource');
const Attribute = require('./attribute');

const Product = require('./product');
const ProductModel = require('../models/product');


class ProductCollection extends Resource {

  constructor() {
    super();

    /**
     * Model for querying data
     * @type {MongooseModel}
     */
    this._model = ProductModel;
  }


  /**
   * General querying for products
   */
  query(text, categories = [], from = 0, limit = 20) {
    this._model.find(/* ... */);

    // TODO: Do similar data mapping as findByIds method
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
