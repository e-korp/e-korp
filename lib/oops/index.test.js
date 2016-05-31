
const chai = require('chai');
const expect = chai.expect;
const Oops = require('./');

describe('Oops', () => {

  describe('Getters and setters', () => {

    it('Constructor should set a message, httpcode, code and error', () => {
      const testError = new Error('test');
      const e = new Oops('mymessage', 404, 20, testError);
      expect(e.message).to.equal('mymessage');
      expect(e.code).to.equal(20);
      expect(e.httpCode).to.equal(404);
      expect(e.error).to.equal(testError);
    });

  });

});
