const Resource = require('./resource');
const StockModel = require('../models/stock');

class Stock extends Resource {

  constructor() {
    super();
  }


  /**
   * Gets the current stock of a specific product
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} productId The product ID to get stock for
   * @return {void}
   */
  getStock(productId) {
    return productId;
  }


}

module.exports = Stock;
