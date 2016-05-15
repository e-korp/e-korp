// Import router and routing helpers
const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

// Import the resource
const Product = require('../resources/product');
const ProductCollection = require('../resources/product-collection');


/**
 * Get all products
 */
router.get('/', co.wrap(function *(next) {
  const collection = new ProductCollection();

  try {
    yield collection.getAll();

    this.status = 200;
    this.body = collection.getData();
  } catch (err) {
    this.status = 400;
    this.body = {message: err.message};
  }

  yield next;
}));


/**
 * Get specific product
 */
router.get('/:id', co.wrap(function *(next) {
  try {
    const product = yield Product.getById(this.params.id);
    this.status = 200;
    this.body = product;
  } catch (err) {
    this.status = 404;
    this.body = err.message;
  }

  yield next;
}));

module.exports = router.routes();
