const chai = require('chai');
const expect = chai.expect;

const Collection = require('../../../src/resources/collection');

describe('Collection', () => {
  describe('Getters and setters', () => {
    it('Should get and set collection', () => {
      const d = ['item1', 'item2'];
      const c = new Collection();
      c.items = d;
      expect(c.items).to.deep.equal(d);
    });
  });

  describe('Constructor', () => {
    it('Should set items', () => {
      const d = ['item1', 'item2'];
      const c = new Collection(d);
      expect(c.items).to.deep.equal(d);
    });

    it('Should default to empty list of items', () => {
      const c = new Collection();
      expect(c.items).to.deep.equal([]);
    });
  });

  describe('Add', () => {
    it('Should add an item to the collection', () => {
      const c = new Collection();
      c.add('An item');
      expect(c.items.length).to.equal(1);
    });
  });

});
