const chai = require('chai');
const expect = chai.expect;
const decache = require('decache');

let envir = require('./environment');

describe('Environment', () => {

  beforeEach(() => {
    // Reset the module to the initial state
    decache('./environment');
    envir = require('./environment');

    // Cleanup
    delete process.env.TEST_VAR;
  });

  describe('Apply fallback', () => {
    it('Should not change existing ENV vars', () => {
      process.env.TEST_VAR = 'test';
      envir.test.DEFAULT_ENV.TEST_VAR = 'overwritten';
      envir.applyFallback();
      expect(process.env.TEST_VAR).to.equal('test');
    });

    it('Should fallback on default environment variables', () => {
      envir.test.DEFAULT_ENV.TEST_VAR = 'set by fallback';
      envir.applyFallback();
      expect(process.env.TEST_VAR).to.equal('set by fallback');
    });
  });

});
