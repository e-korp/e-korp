
const chai = require('chai');
const expect = chai.expect;
const errorResponse = require('./error-response');

describe('Error response middleware', () => {

  it('Should add an error method to the response object', () => {
    const res = {};
    errorResponse(null, {}, res, () => {});
    expect(res.error).to.be.a.function;
  });

  it('Should call next middleware with err, req, res', (done) => {
    const res = {res: true};
    const req = {req: true};
    errorResponse('error', req, res, (err, request, response) => {
      expect(err).to.equal('error');
      expect(request).to.deep.equal(req);
      expect(response).to.deep.equal(res);
      done();
    });
  });

  it('Should construct an error object', (done) => {
    const expectedFormat = {
      error: {
        message: 'testmessage',
        code: 22,
        err: 'Error: Testerror',
      },
    };

    // Setup fake response object
    const res = {
      json: (obj) => {
        expect(obj).to.deep.equal(expectedFormat);
        done();
      },
    };

    errorResponse('error', {}, res, (err, request, response) => {
      response.error('testmessage', 22, new Error('Testerror'));
    });
  });


});
