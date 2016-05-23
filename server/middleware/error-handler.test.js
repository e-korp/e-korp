
const chai = require('chai');
const expect = chai.expect;
const errorResponse = require('./error-handler');

describe('Error response middleware', () => {

  it('Should not call next middleware');

  it('Should construct an error object', (done) => {
    const testError = new Error('Testerror');

    const expectedFormat = {
      error: {
        code: 22,
        message: 'fault',
        err: testError,
      },
    };

    // Setup fake response object
    const res = {
      status: () => {
        return this;
      },
      json: (obj) => {
        expect(obj).to.deep.equal(expectedFormat);
        done();
      },
    };

    const fakeOops = {
      message: 'fault',
      code: 22,
      error: testError,
    };

    errorResponse(fakeOops, {}, res, () => {});
  });

  it('Should set default HTTP status code to 500');


});
