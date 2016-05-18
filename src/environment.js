/**
 * Specify fallback for environment variables
 */

const DEFAULT_ENV = {
  PORT: 3000,
  NODE_ENV: 'development',
  MONGO_1_PORT_27017_TCP_ADDR: 'localhost',
  MONGO_1_PORT_27017_TCP_PORT: '27017',
  MAIN_DB_NAME: 'e-korp',
  SEED: false,
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
  applyFallback: applyFallback,

  // For testing purposes. Do not use this externally
  test: {
    DEFAULT_ENV: DEFAULT_ENV,
  },
};
