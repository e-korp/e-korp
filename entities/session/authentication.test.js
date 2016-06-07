const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

const should = chai.should();
chai.use(chaiAsPromised);

const Auth = require('./authentication');

describe('Authentication', () => {
  describe('Generate JWT', () => {
    it('Should generate a token string', () => {
      return Auth.generateJwt({id: 'id'}).then(token => {
        expect(token).to.be.a.string;
      });
    });
  });

  describe('User payload', () => {
    it('Should not add non-specified attributes', () => {
      const res = Auth.userPayload({
        email: 'Testemail',
        name: 'Testname',
        id: 'test',
        role: 1,
        password: 'Should not be in the payload',
      });

      expect(res).to.deep.equal({
        email: 'Testemail',
        name: 'Testname',
        id: 'test',
        role: 1,
      });
    });
  });

  describe('Generate hash', () => {
    it('Should generate a hash from a string', () => {
      return Auth.generateHash('password').then(hash => {
        expect(hash).to.be.a.string;
        expect(hash.length).to.equal(60);
      });
    });
  });

  describe('Compare password hash', () => {
    it('Should return true if the password matched', () => {
      return Auth.generateHash('myPass').then(hash => {
        return Auth.compareHash(hash, 'myPass');
      }).then(match => {
        expect(match).to.be.true;
      });
    });
  });

  describe('Validate JWT', () => {
    it('Should return the payload on success', () => {
      return Auth.generateJwt({role: 13}).then(token => {
        return Auth.validateJwt(token).then(payload => {
          expect(payload.role).to.equal(13);
        });
      });
    });

    it('Should reject a tampered token', () => {
      return Auth.generateJwt({role: 13}).then(token => {
        return Auth.validateJwt(token + 'tampatamp')
          .should.be.rejectedWith(Error);
      });
    });
  });
});
