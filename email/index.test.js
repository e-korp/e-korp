const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

const should = chai.should();
chai.use(chaiAsPromised);

const email = require('./');

describe('Email', () => {
  describe('Send customer activation email', () => {
    it('should send the email to the customer email address');
    it('should reject the promise if the email sending fails');
    it('should resolve the promise if the email sending succeeded');
    it('should include the activation code in the message');
  });
});
