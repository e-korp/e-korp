const express = require('express');
const app = express();

/**
 * Adds an error-method to the response object so we can construct a standard
 * error object for the client
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
app.use((err, req, res, next) => {
  res.error = (message, error = null) => {
    res.json({
      error: {
        message: message,
        code: error !== null ? error.code : 0,
        stackTrace: error !== null ? error.stackTrace : null,
      },
    });
  };

  next(err);
});
