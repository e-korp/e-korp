// Import router and routing helpers
const koaRouter = require('koa-router');
const co = require('co');
const router = koaRouter();

// Import the resource
const LogCollection = require('../resources/log/log-collection');
const Log = require('../resources/log/log');

const winston = require('winston');
const applog = winston.loggers.get('applog');


/**
 * Get logs
 */
router.get('/', function *(next) {
  const lc = new LogCollection();
  let levels = [];

  try {
    levels = this.request.query.levels.split(',');
  } catch (e) {
    applog.warn('Invalid level parameter');
    levels = [1];
  }

  console.log(this.request.query);


  try {
    yield lc.query(
      levels,
      this.params.dateFrom,
      this.params.dateTo,
      this.params.order
    );
    this.status = 200;
    this.body = lc.getData();
  } catch (e) {
    this.status = 400;
    this.body = {message: 'Could not fetch logs' + e};
  }

  yield next;
});


/**
 * Add new log entry
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
router.post('/', function *(next) {
  applog.info(this.request.body);

  try {
    const l = new Log();
    l.message = this.request.body.message;
    l.data = this.request.body.data;
    l.level = this.request.body.level;

    yield l.save();

    this.status = 201;
    this.body = l.getData();
  } catch (e) {
    this.status = 400;
    this.body = {message: e.message};
  }

  yield next;
});

module.exports = router.routes();
