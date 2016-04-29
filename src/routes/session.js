const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

router.post('/', function *(next) {
  this.status = 200;
  this.body = {message: 'HEJ!'};
});


module.exports = router.routes();
