const chai = require('chai');
const expect = chai.expect;

const CandidateRouter = require('./candidate-router');

describe('Candidate router', () => {
  it('should export a router', () => {
    expect(CandidateRouter.router).to.not.be.undefined;
  });
});
