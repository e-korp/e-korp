const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

router.get('/', co.wrap(function *(next) {
  this.status = 200;
  this.body = 'Category listing';

  yield next;
}));

module.exports = router.routes();
