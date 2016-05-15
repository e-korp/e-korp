// Import router and routing helpers
const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

// Import cache lib for direct access
const cache = require('../lib/cache');

router.get('/', co.wrap(function *(next) {
  const cacheDump = yield cache.exportStore();

  this.status = 200;
  this.body = cacheDump;

  yield next;
}));

module.exports = router.routes();
