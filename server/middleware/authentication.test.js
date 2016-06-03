
const chai = require('chai');
const expect = chai.expect;
const Auth = require('./authentication');

describe('Authentication middleware', () => {
  describe('Authenticate JWT', () => {
    it('should return next with error if token was tampered with');
  });

  describe('Admin', () => {
    it('should return next with error if the user role was not admin');
  });
});
