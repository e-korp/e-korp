import chai from 'chai';

const expect = chai.expect;

const Resource = require('../../../src/resources/resource');

describe('Resource', () => {

  describe('Getters and setters', () => {

    it('Should get a reference to the cache', () => {
      const r = new Resource();
      expect(r.cache).to.not.be.undefined;
    });

  });

  describe('Get cache key', () => {
    it('Should throw error if arguments missing', () => {
      const r = new Resource();
      expect(() => r.getCacheKey()).to.throw(Error);
    });

    it('Should return a 32 char long string as a cache key', () => {
      const r = new Resource();
      expect(r.getCacheKey('product', 'myquery')).to.be.a.string;
      expect(r.getCacheKey('product', 'myquery').length).to.equal(32);
    });

    it('Should accept strings as query', () => {
      const r = new Resource();
      expect(r.getCacheKey('Product', 'myquery')).to.be.a.string;
    });

    it('Should accept objects as query', () => {
      const r = new Resource();
      expect(r.getCacheKey('Product', {text: 'myquery'})).to.be.a.string;
    });

    it('Should generate the same result for same input', () => {
      const r = new Resource();
      expect(r.getCacheKey('Product', {text: 'myquery'})).to.be.a.string;
    });

    it('Should produce the same result case insensitive', () => {
      const r = new Resource();
      const res1 = r.getCacheKey('PrOduCt', 'myquery');
      const res2 = r.getCacheKey('product', 'myquery');

      expect(res1).to.equal(res2);
    });
  });

});
