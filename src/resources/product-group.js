const Resource = require('./resource');

class ProductGroup extends Resource {

  constructor() {
    super();

    // Class variables
    this._name = null;
    this._id = null;
    this._products = [];
  }


  /**
   * Gets all the available configurable options for this product group
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {object} Object with the available options
   */
  getAllOptions() {
    const options = {};

    // Loop through all products in the group
    for (const product of this._products) {
      // We only want to compare the configurable attributes of the products
      for (const attr of product.getConfigurableAttributes()) {
        // Check if the key exists in the list we are constructing
        if (attr.name in options) {
          // Append this option to the option list if it doesnt exists
          if (options[attr.name].indexOf(attr.value) === -1) {
            options[attr.name].push(attr.value);
          }
        } else {
          // Create new array in the option list
          options[attr.name] = [attr.value];
        }
      }
    }

    return options;
  }


  /**
   * Gets the options that are available in stock
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {void}
   */
  getInStockOptions() {

  }


  /**
   * Adds a product to the list of products
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Product} product The product to add
   * @return {void}
   */
  addProduct(product) {
    this._products.push(product);
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

  get products() {
    return this._products;
  }

  set products(products) {
    this._products = products;
  }


}

module.exports = ProductGroup;
