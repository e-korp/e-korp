/**
 * Specify fallback for environment variables
 */

const DEFAULT_ENV = {
  PORT: 3000,
  DEV: true,
  MONGO_URI: 'mongodb://localhost:27017/e-korp',
  SEED: false,
};


/**
 * Load environment variables from .env
 * This does not overwrite existing environment variables
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @returns {void}
 */
const load = () => {
  // Do not warn to the console about non-existing .env file
  require('dotenv').load({ silent: true });
};


/**
 * Sets default environment variables
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const applyFallback = () => {
  for (const env in DEFAULT_ENV) {
    // Do not overwrite already set variables
    if (!(env in process.env)) {
      process.env[env] = DEFAULT_ENV[env];
    }
  }
};


module.exports = {
  load: load,
  applyFallback: applyFallback,

  // For testing purposes. Do not use this externally
  test: {
    DEFAULT_ENV: DEFAULT_ENV,
  },
};
