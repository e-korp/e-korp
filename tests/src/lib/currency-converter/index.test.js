const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();


// Use require to be able to clear the require cache (clear module state after
// each test)
let cc = require('../../../../src/lib/currency-converter');

const decache = require('decache');

describe('Currency converter', () => {

  beforeEach(() => {
    decache('../../../../src/lib/currency-converter');
    cc = require('../../../../src/lib/currency-converter');
  });

  describe('Currencies constant', () => {
    it('Should be accessible', () => {
      expect(cc.CURRENCIES).to.not.be.undefined;
    });

    it('Should contain currency keys', () => {
      expect(cc.CURRENCIES.SEK).to.not.be.undefined;
    });

    it('Should contain a symbol for the currency', () => {
      expect(cc.CURRENCIES.SEK.symbol).to.equal('kr');
    });

    it('Should contain a text for the currency', () => {
      expect(cc.CURRENCIES.SEK.text).to.equal('Kronor');
    });
  });

  describe('Set currency value', () => {
    it('Should throw error when setting value for unsupported currency', () => {
      expect(() => cc.test.setCurrencyRate('BANAN', 100))
        .to.throw('Unsupported currency code');
    });

    it('Should set the provided value for the provided currency', () => {
      cc.test.setCurrencyRate('SEK', 100.124124);
      expect(cc.test.getConversionTable().SEK).to.equal(100.124124);
    });
  });

  describe('Clear conversion table', () => {
    it('Should reset the conversion table', () => {
      cc.test.setCurrencyRate('SEK', 200);
      cc.test.clearConversionTable();
      expect(cc.test.getConversionTable()).to.deep.equal({});
    });

    it('Should reset the latest updated date', () => {
      const testDate = new Date('2017-06-04 20:20:20');
      cc.test.setLatestCurrencyUpdate(testDate);
      expect(cc.getLatestCurrencyUpdate()).to.equal(testDate);
      cc.test.clearConversionTable();
      expect(cc.getLatestCurrencyUpdate()).to.be.null;
    });
  });

  describe('Convert', () => {
    it('Should throw error if the currency is not supported', () => {
      expect(() => cc.convert(100, 'BANAN')).to.throw('Unsupported currency');
    });

    it('Should throw error if no conversion exist for the currency', () => {
      expect(() => cc.convert(100, 'SEK'))
        .to.throw('No conversion data for provided currency');
    });

    it('Should return the product of the value and the currency rate', () => {
      cc.test.setCurrencyRate('SEK', 1.55);
      expect(cc.convert(12, 'SEK')).to.equal(18.6);
    });

    it('Should be able to convert (return) the base currency', () => {
      expect(cc.convert(1212, cc.CURRENCIES.EUR)).to.equal(1212);
    });
  });

});
