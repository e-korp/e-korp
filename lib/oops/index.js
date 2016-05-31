/**
 * Simple logging data format
 */

class Oops {
  constructor(message, httpCode, code, error = null) {
    this._message = message;
    this._httpCode = httpCode;
    this._code = code;
    this._error = error;
  }

  /**
   * Getters and setters
   */

  set message(message) {
    this._message = message;
  }

  get message() {
    return this._message;
  }

  set httpCode(httpCode) {
    this._httpCode = httpCode;
  }

  get httpCode() {
    return this._httpCode;
  }

  set code(code) {
    this._code = code;
  }

  get code() {
    return this._code;
  }

  set error(error) {
    this._error = error;
  }

  get error() {
    return this._error;
  }

  toString() {
    return `Oops: '${this._message}' (${this._code}) [${this._error}]`;
  }

}

module.exports = Oops;
