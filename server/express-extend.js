/**
 * In this module we extend express to simplify route responses
 */

const express = require('express');

/**
 * Add oops method to the response object for easy error handling. This writes
 * the Oops error object as response
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Oops} oops Oops object (error object)
 * @return {void}
 */
express.response.oops = function(oops) {
  // TODO: Validate that the oops parameters is instance of oops

  this.header('Content-Type', 'application/vnd.api+json');
  this.status(oops.httpCode || 500);

  return this.json({
    errors: [{
      status: `${oops.httpCode || 500}`,
      code: `${oops.code}`,
      title: oops.message,
      meta: oops.error
    }],
  });
};

/**
 * Add reply method to the response object. Used to send data to the client.
 * This method extends the 'json' method by setting correct headers before
 * sending
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Object} data The data to send to the client
 * @return {void}
 */
express.response.reply = function(data) {
  this.header('Content-Type', 'application/vnd.api+json');
  this.json(data);
};