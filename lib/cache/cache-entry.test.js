const expect = require('chai').expect;
const CacheEntry = require('./cache-entry');

describe('Cache entry', () => {

  describe('Constructor', () => {
    it('Should set key and data in constructor', () => {
      const entry = new CacheEntry('mykey', 'mydata');
      expect(entry.key).to.equal('mykey');
      expect(entry.data).to.equal('mydata');
    });
  });

});
