const chai = require('chai');
const expect = chai.expect;

const ProductCollection = require('../../../src/resources/product-collection');

describe('ProductCollection', () => {
  describe('Getters and setters', () => {
    it('Should get and set model', () => {
      const pc = new ProductCollection();
      pc.model = 'Some model';
      expect(pc.model).to.equal('Some model');
    });

  });

/*
  describe('Query', () => {

  });*/

});
