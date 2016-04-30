/**
 * Main server script setup global middleware for Koa
 */

const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');

// Get the loggers
const applog = winston.loggers.get('applog');
const accesslog = winston.loggers.get('accesslog');

// Setup koa and routing
const router = koaRouter();
const app = new koa();

// Log response times
app.use(function *(next) {
  const start = Date.now();
  yield next;
  const delta = Math.ceil(Date.now() - start);

  // Log the request
  accesslog.info(
    `${this.ip} - '${this.method} ${this.url}' ${this.status} ` +
    `${this.length}b - ${delta}ms`
  );

  // Set response time header
  this.set('X-Response-Time', delta + 'ms');
});


// Handle broken JSON bodies
app.use(bodyParser({
  onerror: (err, ctx) => {
    ctx.status = 400;
    ctx.body = {message: 'Invalid request body'};
  },
}));

router.use('/categories', require('./routes/categories'));

app
  .use(router.routes())
  .use(router.allowedMethods());


// TODO: Move port selection to .env file
applog.info('Server listening on port 3000');
app.listen(3000);
