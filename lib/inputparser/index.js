/**
 * Small library to help with input parsing
 */


/**
 * Parses dates into a valid date range
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Date}  fromDate   Date object with the starting date
 * @param  {Date}  toDate     Date object with the ending date
 * @return {Array}            Array with [start, end] dates
 */
const dateRange = (fromDate, toDate) => {
  // If no fromDate is set, set it to the beginning of time
  if (!(fromDate instanceof Date)) {
    fromDate = new Date('0000-01-01');
  }

  if (!(toDate instanceof Date)) {
    toDate = new Date('3000-01-01');
  }

  if (fromDate > toDate) {
    throw new Error('From-date is after to-date');
  }

  return [fromDate, toDate];
};


/**
 * Split listed query inputs into an array of options
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {String} param The param from the end-user
 * @return {Array}        List of split options
 */
const queryList = (param) => {
  // Return empty list if parameter not set
  if (!param) {
    return [];
  }

  // Split the string by comma and trim whitespace
  return param.split(',').map(arg => {
    return arg.trim();
  });
};


/**
 * Helps to decide sorting order
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} sortingOrder desc or asc
 * @return {string}              The decided sort order
 */
const order = (sortingOrder) => {
  if (!sortingOrder) {
    return 'desc';
  }

  sortingOrder = sortingOrder.toLowerCase();

  if (['desc', 'asc'].indexOf(sortingOrder) === -1) {
    return 'desc';
  }

  return sortingOrder;
};


module.exports = {
  dateRange: dateRange,
  queryList: queryList,
  order: order,
};
