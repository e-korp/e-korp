const applog = require('winston').loggers.get('applog');

/**
 * Specify fallback for environment variables
 */

const DEFAULT_ENV = {
  PORT: 3000,
  NODE_ENV: 'development',
  EKORPDOCKER_MONGO_1_PORT_27017_TCP_ADDR: '127.0.0.1',
  EKORPDOCKER_MONGO_1_PORT_27017_TCP_PORT: '27017',
  EKORPDOCKER_REDIS_1_PORT_6379_TCP_PORT: '127.0.0.1',
  EKORPDOCKER_REDIS_1_PORT_6379_TCP_ADDR: '6379',
  MAIN_DB_NAME: 'ekorp',
  SEED: false,
};

/**
 * Sets default environment variables
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const applyFallback = () => {

  console.log('ENIVORIR', process.env);

  for (const env in DEFAULT_ENV) {
    // Do not overwrite already set variables
    if (!(env in process.env)) {
      applog.warn(`Missing ENV var ${env}. Set default: ${DEFAULT_ENV[env]}`);
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
