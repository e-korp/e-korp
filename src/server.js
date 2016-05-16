/**
 * Main server script setup global middleware for Koa
 */

const co = require('co');
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

/**
 * @TODO Move all middleware to a separate place, this is messy
 */

// Handle critical errors
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = {message: err.message};
    applog.error('Critical error', err);
  }
});

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

// POSTs must have a body
app.use(function *(next) {
  if (this.request.method === 'POST' && !this.request.body) {
    this.status = 400;
    this.body = {message: 'POST must have a body'};
  } else {
    yield next;
  }
});

// Mount sub-routers
// TODO: Handle this in separate file
router.use('/categories', require('./controllers/categories'));
router.use('/products', require('./controllers/products'));
router.use('/logs', require('./controllers/logs'));

// For development
router.use('/cache', require('./controllers/cache'));

app
  .use(router.routes())
  .use(router.allowedMethods());


// TODO: Move port selection to .env file
applog.info(`Server listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);
