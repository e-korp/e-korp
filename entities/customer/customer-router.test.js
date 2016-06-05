const chai = require('chai');
const expect = chai.expect;

const CustomerRouter = require('./customer-router');

describe('Customer router', () => {
  describe('Create customer', () => {
    it('should set customer to activated if confirmation is disabled');
    it('should set customer to inactive if confirmation is enabled');
    it('should send an activation email if confirmation is enabled');
  });

});
