/**
 * Main server script setup global middleware for Koa
 */

const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');
const applog = winston.loggers.get('applog');

//  const co = require('co');

const router = koaRouter();
const app = new koa();

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
