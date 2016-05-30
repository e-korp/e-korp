const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/main');
const applog = require('winston').loggers.get('applog');

/**
 * Signs and generates a JSON Web Token with payload
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {object}   payload  Data to place in the token
 * @return {Promise}           Resolves token string on success, rejects errors
 */
const generateJwt = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, config.jwtSecret, {}, (err, token) => {
      if (err) {
        return reject(err);
      }

      return resolve(token);
    });
  });
};


/**
 * Validates a JWT and returns the payload
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string} token JSON web token string
 * @return {Promise}      Resolves promise with payload on success, rejects
 *                        error on failure
 */
const validateJwt = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, payload) => {
      if (err) {
        return reject(err);
      }

      return resolve(payload);
    });
  });
};


/**
 * Constructs the data payload for tokens, using only non-sensitive information
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {User} user Mongoose model
 * @return {object}    Payload data
 */
const userPayload = (user) => {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
  };
};


/**
 * Generates a hash of a string
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}   data     The string to hash
 * @return {Promise}           Resolves generated hash, rejects error by bcrypt
 */
const generateHash = (data) => {
  return new Promise((resolve, reject) => {
    // Generate salt
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        return reject(saltErr);
      }

      bcrypt.hash(data, salt, (hashErr, hash) => {
        if (hashErr) {
          return reject(hashErr);
        }

        return resolve(hash);
      });
    });
  });
};


/**
 * Compares a hash against a string to see if it matches
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {string}   hash       Hash to compare with
 * @param  {string}   comparable String to compare
 * @return {Promise}             True on match, false otherwise
 */
const compareHash = (hash, comparable) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(comparable, hash, (err, match) => {
      if (err) {
        return reject(err);
      }

      return resolve(match);
    });
  });
};


module.exports = {
  generateJwt: generateJwt,
  userPayload: userPayload,
  generateHash: generateHash,
  compareHash: compareHash,
  validateJwt: validateJwt,
};
