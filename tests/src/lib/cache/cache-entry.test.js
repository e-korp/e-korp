import { expect } from 'chai';
import CacheEntry from '../../../../src/lib/cache/cache-entry';

describe('Cache entry test', () => {

  describe('Constructor', () => {
    it('Should set key and data in constructor', () => {
      const entry = new CacheEntry('mykey', 'mydata');
      expect(entry.key).to.equal('mykey');
      expect(entry.data).to.equal('mydata');
    });
  });

});
