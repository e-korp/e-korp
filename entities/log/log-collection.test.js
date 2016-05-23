const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.should();

const expect = chai.expect;
chai.use(chaiAsPromised);

const LogCollection = require('./log-collection');

describe('LogCollection', () => {

  describe('Query', () => {
    it('Should reject promise if invalid sorting option', () => {
      const lc = new LogCollection();

      return lc.query([], null, null, 'invalid')
        .should.be.rejectedWith('Invalid sorting value');
    });

    it('Should reject promise if invalid levels option', () => {
      const lc = new LogCollection();

      return lc.query('invalid')
        .should.be.rejectedWith('Levels must be an array');
    });
  });

});
