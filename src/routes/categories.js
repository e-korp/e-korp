const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();


const myFuckedUpFunction = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('result from the fucked up function');
    }, 5000);
  });
};


router.get('/', co.wrap(function *(next) {

  let result = yield myFuckedUpFunction();

  console.log("Done...");

  this.status = 200;
  this.body = {message: result};

  yield next;
}));

module.exports = router.routes();
