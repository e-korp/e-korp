const Resource = require('./resource');
const Attribute = require('./attribute');
const ProductModel = require('../models/product');

/**
 * Base product class, extend this if you want more out of it
 */

class Product extends Resource {

  constructor() {
    super();

    // Class variables for general product attributes
    this._name = null;
    this._id = null;

    // Configurable attributes, true indicates configurable
    this._attributes = [
      // Default attributes
      new Attribute('size', null, true),
      new Attribute('color', null, true),
    ];
  }


  /**
   * Loads a product into the resource data structure
   * @todo Should we cache this entire object instance or just the data from
   * the model?
   * @todo Test
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string}         id The product ID to load from
   * @return {Promise}        Rejecting promise if the product couldnt load,
   *                          resolving promise if the product loaded correctly
   */
  load(id) {
    return new Promise((resolve, reject) => {
      // Try to load from cache
      const cacheKey = this.getCacheKey(id);

      this.cache.get(cacheKey).then((cachedData) => {
        resolve(cachedData);
      }).catch((cacheErr) => {
        // Did not exist in cache. Load from the model
        return ProductModel.findOne(id).exec().then((productModel) => {
          // Add the loaded record to the cache and resolve the loading
          this.cache.add(cacheKey, productModel, ['product']);
          resolve(productModel);
        }).catch((err) => {
          // The product was not found in the database
          reject(err);
        });
      });
    });
  }


  /**
   * Map loaded data into this object. Acts like a bridge between the model and
   * this resource
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {object} data Data object to map
   * @return {void}
   */
  map(data) {
    this._name = data.name;
    this._materials = data.materials;
  }


  getById(id) {
    return this.load(id).then((data) => {
      return this.map(data);
    });
  }


  /**
   * Gets a specific attribute by name
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} name Name of the attribute to get
   * @return {Attribute}   The found attribute. Throws error on not found
   */
  getAttribute(name) {
    for (const attr of this._attributes) {
      if (attr.name === name) {
        return attr;
      }
    }

    throw new Error('Attribute not found');
  }


  /**
   * Gets all attributes that is configurable
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {array} Array of configurable attributes
   */
  getConfigurableAttributes() {
    return this._attributes.filter((attribute) => {
      return attribute.configurable;
    });
  }


  /**
   * Getters and setters
   */

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get attributes() {
    return this._attributes;
  }

  set attributes(attributes) {
    this._attributes = attributes;
  }

  get size() {
    return this.getAttribute('size').value;
  }

  set size(size) {
    this.getAttribute('size').value = size;
  }

  get color() {
    return this.getAttribute('color').value;
  }

  set color(color) {
    this.getAttribute('color').value = color;
  }

}

module.exports = Product;
