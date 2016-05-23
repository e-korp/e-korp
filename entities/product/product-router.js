// Import router and routing helpers
const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import the resource
const Product = require('./product-resource');
const ProductCollection = require('./product-collection');

/**
 * Get all products
 */
router.get('/', async((req, res) => {
  const collection = new ProductCollection();

  try {
    await(collection.getAll());
    res.status(200).json(collection.getData());
  } catch (err) {
    res.status(500).error('Could not get products', err);
  }
}));


/**
 * Get specific product
 */
router.get('/:id', async((req, res) => {
  try {
    const product = await(Product.getById(this.params.id));
    res.status(200).json(product);
  } catch (err) {
    res.status(404).error('Could not find product', err);
  }
}));

module.exports = router;