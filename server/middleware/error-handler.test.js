
const chai = require('chai');
const expect = chai.expect;
const errorResponse = require('./error-handler');

describe('Error response middleware', () => {

  it('should not call next middleware');

  it('should construct an error object', (done) => {
    const testError = new Error('Testerror');

    const expectedFormat = {
      errors: [{
        status: '404',
        code: '5000',
        title: 'fault',
        meta: testError,
      }],
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
      httpCode: 404,
      code: 5000,
      message: 'fault',
      error: testError,
    };

    errorResponse(fakeOops, {}, res, () => {});
  });

  it('should set default HTTP status code to 500', done => {
    const expectedFormat = {
      errors: [{
        status: '500',
        code: '22',
        title: 'test',
        meta: 'test',
      }],
    };

    // Setup fake response object
    const res = {
      status: (code) => {
        expect(code).to.equal(500);
        return this;
      },
      json: (obj) => {
        expect(obj).to.deep.equal(expectedFormat);
        done();
      },
    };

    const fakeOops = {
      httpCode: undefined,
      code: 22,
      message: 'test',
      error: 'test',
    };

    errorResponse(fakeOops, {}, res, () => {});
  });


});
