const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Import cache lib for direct access
const cache = require('../../lib/cache');

router.get('/', async((req, res) => {
  const cacheDump = await(cache.exportStore());

  res.status = 200;
  res.body = cacheDump;
}));

module.exports = router;
