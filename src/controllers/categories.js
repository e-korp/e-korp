// Import router and routing helpers
const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

// Import the resource
const Category = require('../resources/category');


router.get('/', co.wrap(function *(next) {

  const categories = yield Category.getCategoryList();

  this.status = 200;
  this.body = categories;

  yield next;
}));

module.exports = router.routes();
