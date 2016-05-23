const express = require('express');

/**
 * Adds an error-method to the response object so we can construct a standard
 * error object for the client
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
express.response.error = (message, code = 1, error = null) => {
  express.response.json({
    error: {
      message: message,
      code: code,
      err: error !== null ? error.toString() : null,
    },
  });
};
