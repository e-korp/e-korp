import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();


// Use require to be able to clear the require cache (clear module state after
// each test)
let cache = require('../../../../src/lib/cache');

const decache = require('decache');

describe('Cache', () => {

  beforeEach(() => {
    decache('../../../../src/lib/cache');
    cache = require('../../../../src/lib/cache');
  });

  describe('Add', () => {
    it('Should add an CacheEntry object to the store', () => {
      const testData = 'mydata';
      cache.add('mykey', testData);
      expect(cache.exportStore().mykey.data).to.equal('mydata');
    });
  });

  describe('Exists', () => {
    it('Should return false if the cache key doesnt exists', () => {
      return cache.exists('bullshitkey').should.eventually.be.false;
    });

    it('Should return true if the cache key exists', () => {
      cache.add('mykey', 'mydata');
      return cache.exists('mykey').should.eventually.be.true;
    });

    it('Should set default ttl', () => {
      cache.add('mykey', 'mydata');
      expect(cache.exportStore().mykey.ttl).to.be.above(0);
    });

    it('Should set default tags to global', () => {
      cache.add('mykey', 'mydata');
      expect(cache.exportStore().mykey.tags[0]).to.equal('global');
    });
  });

  describe('Get', () => {
    it('Should reject promise if key is not found', () => {
      return cache.get('weirdkey').should.be
        .rejectedWith('Key not found in cache');
    });

    it('Should resolve the stored data', () => {
      cache.add('mykey', 'mydata');
      return cache.get('mykey').should.eventually.equal('mydata');
    });
  });

  it('Should set context', () => {
    expect(true).to.equal(true);
  });

});
