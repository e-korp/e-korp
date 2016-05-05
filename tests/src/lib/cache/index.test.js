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
      return cache.add('mykey', testData).then(() => {
        return cache.exportStore().then((data) => {
          expect(data.mykey.data).to.equal('mydata');
        });
      });
    });
  });

  describe('Exists', () => {
    it('Should return false if the cache key doesnt exists', () => {
      return cache.exists('bullshitkey').should.eventually.be.false;
    });

    it('Should return true if the cache key exists', () => {
      return cache.add('mykey', 'mydata').then(() => {
        return cache.exists('mykey').should.eventually.be.true;
      });
    });

    it('Should set default ttl', () => {
      return cache.add('mykey', 'mydata').then(() => {
        return cache.exportStore().then((store) => {
          expect(store.mykey.ttl).to.be.above(0);
        });
      });
    });

    it('Should set default tags to global', () => {
      return cache.add('mykey', 'mydata').then(() => {
        return cache.exportStore().then((store) => {
          expect(store.mykey.tags[0]).to.equal('global');
        });
      });
    });
  });

  describe('Get', () => {
    it('Should reject promise error if key is not found', () => {
      return cache.get('loek').should.be.rejectedWith('Key not found in cache');
    });

    it('Should return the stored data', () => {
      return cache.add('mykey', 'mydata').then(() => {
        return cache.get('mykey').should.eventually.equal('mydata');
      });
    });
  });

  describe('Invalidate entries by tag', () => {
    it('Should invalidate entries matching the supplied tag', () => {
      return cache.add('mykey', 'mydata', ['image', 'html']).then(() => {
        return cache.invalidateByTag('image').then(() => {
          return cache.exists('mykey').should.eventually.equal(false);
        });
      });
    });

    it('Should return the amount of entries removed', () => {
      return cache.add('mykey', 'mydata', ['image', 'html']).then(() => {
        return cache.add('mykey2', 'mydata', ['image', 'random']).then(() => {
          return cache.invalidateByTag('image').should.eventually.equal(2);
        });
      });
    });
  });

  describe('Get entries by tag', () => {
    it('Should get entries matching the supplied tag', () => {
      return cache.add('mykey', 'mydata', ['image', 'html']).then(() => {
        return cache.add('mykey2', 'mydata', ['text', 'image']).then(() => {
          return cache.getEntriesByTag('image').then((entries) => {
            expect(entries.length).to.equal(2);
            expect(entries[0].key).to.equal('mykey');
            expect(entries[1].key).to.equal('mykey2');
          });
        });
      });
    });
  });


});
