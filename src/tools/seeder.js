/**
* Database seeder for development
*/

const ProductModel = require('../models/product');

/**
 * Adds some products to the database
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {Promise}   Saved doc on success, error on fail
 */
const seedProducts = () => {
  const p = new ProductModel({
    name: 'The most pantiest pants',
    materials: '100% Cotton',
    description: 'The absolute best pants for panting around',
    shortdescription: 'Nice pants',
    size: '32/32',
    colors: [
      'Brown',
      'Blue',
    ],
  });

  return p.save();
};

module.exports = {
  seedProducts: seedProducts,
};
