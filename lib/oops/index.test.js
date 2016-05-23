
const chai = require('chai');
const expect = chai.expect;
const Oops = require('./');

describe('Oops', () => {

  describe('Getters and setters', () => {

    it('Constructor should set a message, code and error', () => {
      const testError = new Error('test');
      const e = new Oops('mymessage', 20, testError);
      expect(e.message).to.equal('mymessage');
      expect(e.code).to.equal(20);
      expect(e.error).to.equal(testError);
    });

  });

});
