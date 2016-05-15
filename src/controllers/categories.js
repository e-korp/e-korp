// Import router and routing helpers
const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

// Import the resource
const CategoryCollection = require('../resources/category-collection');
const Category = require('../resources/category');


/**
 * Get categories
 */
router.get('/', co.wrap(function *(next) {
  const cc = new CategoryCollection();

  try {
    const categories = yield cc.getAll();
    this.status = 200;
    this.body = categories;
  } catch (e) {
    this.status = 400;
    this.body = 'Could not fetch categories' + e;
  }

  yield next;
}));

/**
 * Add new category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @todo Add middleare for userlevel
 */
router.post('/', co.wrap(function *(next) {

  try {
    const c = new Category(this.body.name);
    yield c.save();
    this.status = 201;
    this.body = c;
  } catch (e) {
    this.status = 400;
    this.body = e;
  }

  yield next;
}));

module.exports = router.routes();
