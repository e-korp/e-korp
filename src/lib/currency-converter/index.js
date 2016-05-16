const fetch = require('node-fetch'); // For currency API calls
const winston = require('winston');
const tasklog = winston.loggers.get('tasklog');


/**
 * Currency converter module
 * To keep up with the current currency values
 */


/**
 * List of currency codes
 * TODO: Fill this list with currencies
 * @type {Array}
 */
const CURRENCIES = {
  'EUR': { symbol: '€', text: 'Euro' },
  'SEK': { symbol: 'kr', text: 'Kronor' },
};


/**
 * Stores the actual conversion values
 * @type {Object}
 */
let conversionTable = {};


/**
 * Holds the date of the last currency update
 * @type {Date}
 */
let latestCurrencyUpdate = null;


/**
 * Hard coded configuration for now
 * @type {Object}
 */
const CONFIG = {
  API_URL: 'https://api.fixer.io/latest', // API to load currency data from
  BASE_CURRENCY: CURRENCIES.EUR,          // Base currency (reference currency)
  UPDATE_INTERVAL: 3600,                  // Currency refresh interval (seconds)
};


/**
 * Sets the rate for a currency
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} currencyCode The currency to set the value for
 * @param  {float}  value        The value to set for
 * @return {void}
 */
const setCurrencyRate = (currencyCode, value) => {
  if (!(currencyCode in CURRENCIES)) {
    throw new Error('Unsupported currency code');
  }

  conversionTable[currencyCode] = value;
};


/**
 * Maps the data from the API to our structure, customise this function after
 * the API choice.
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {mixed} data  Mixed data from the API
 * @return {void}
 */
const mapData = (data) => {
  try {
    let i = 0;

    for (const rate in data.rates) {
      const currencyCode = rate;
      const value = data.rates[currencyCode];

      try {
        setCurrencyRate(currencyCode, value);
      } catch (e) {
        tasklog.warn(e.message, currencyCode);
      }

      i = i + 1;
    }

    if (i === 0) {
      tasklog.error(
        'No currencies were updated with data',
        JSON.stringify(data)
      );
    }

    tasklog.info('Currency conversion table was updated', conversionTable);
  } catch (e) { // Catch if 'rates' with key/value doesnt exist (broken api)
    tasklog.error(
      'Could not get currency rates from data',
      JSON.stringify(data)
    );
    return;
  }

  // Update the last check date
  latestCurrencyUpdate = new Date();
};


/**
 * Clear the current currency conversion table and reset the latest fetch date
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const clearConversionTable = () => {
  conversionTable = {};
  latestCurrencyUpdate = null;
};


/**
 * Returns thre conversion table, for testing purposes
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {object}  The conversion table
 */
const getConversionTable = () => {
  return conversionTable;
};


/**
 * Loads fresh data from the API
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const loadNewData = () => {
  fetch(CONFIG.API_URL).then((response) => {
    if (response.status !== 200) {
      return Promise.reject(new Error('Status code was not 200'));
    }

    return Promise.resolve(response);
  })
  .then((response) => {
    return response.json(); // Convert to JSON
  })
  .then((json) => {
    // Map the data to our structure and set the fetch date
    clearConversionTable();
    mapData(json);
    latestCurrencyUpdate = new Date();
  }).catch((err) => {
    tasklog.error(
      'Could not get currency values from provided API',
      err.message
    );
  });
};


/**
 * Runs the currency watcher
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {void}
 */
const run = () => {
  loadNewData();

  setInterval(() => {
    // Fetch new data
    tasklog.info('Fetching new currency data. Last check was ' +
      (latestCurrencyUpdate === null ? 'never' : latestCurrencyUpdate));

    loadNewData();
  }, CONFIG.UPDATE_INTERVAL * 1000);
};


/**
 * Converts a value from the base currency to the provided currency
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {float}  value    The value to convert
 * @param  {string} currency The currency format to convert to
 * @return {float}           Converted currency value
 */
const convert = (value, currency) => {
  // Return right away when trying to convert to the base currency
  if (currency === CONFIG.BASE_CURRENCY) {
    return value;
  }

  // Check if we can convert this currency
  if (!(currency in conversionTable)) {

    // The currency could not be converted, check if the currency is valid
    if (!(currency in CURRENCIES)) {
      throw new Error('Unsupported currency');
    }

    throw new Error('No conversion data for provided currency');
  }

  return value * conversionTable[currency];
};


/**
 * Returns the date of the latest currenct update
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @return {Mixed} Date if a successful currency rate fetch has been made,
 *                 null otherwise
 */
const getLatestCurrencyUpdate = () => {
  return latestCurrencyUpdate;
};


/**
 * Sets the latest update date. For testing purposes
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Date} date  Date to set
 * @return {void}
 */
const setLatestCurrencyUpdate = (date) => {
  latestCurrencyUpdate = date;
};


module.exports = {
  run: run,
  convert: convert,
  getLatestCurrencyUpdate: getLatestCurrencyUpdate,
  CURRENCIES: CURRENCIES,

  // For testing purposes only, do not use these functions
  test: {
    setCurrencyRate: setCurrencyRate,
    getConversionTable: getConversionTable,
    clearConversionTable: clearConversionTable,
    setLatestCurrencyUpdate: setLatestCurrencyUpdate,
  },
};
