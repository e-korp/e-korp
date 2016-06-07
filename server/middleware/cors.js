/**
 * Appends headers to allow cross
 * @todo test this, do not allow from everywhere
 */
module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, X-Access-Token'
  );

  return next();
};
