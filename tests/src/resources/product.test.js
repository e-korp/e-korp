import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();

const Product = require('../../../src/resources/product');
const Attribute = require('../../../src/resources/attribute');

describe('Product', () => {
  describe('Getters and setters', () => {
    it('Should set and get name', () => {
      const p = new Product();
      p.name = 'The name';
      expect(p.name).to.equal('The name');
    });

    it('Should set and get id', () => {
      const p = new Product();
      p.id = 1212;
      expect(p.id).to.equal(1212);
    });

    it('Should set and get attributes', () => {
      const p = new Product();
      const l = ['2', '1'];
      p.attributes = l;
      expect(p.attributes).to.deep.equal(l);
    });
  });

  describe('Default attributes', () => {
    it('Should have color and size as a default attributes', () => {
      const p = new Product();
      expect(p.getAttribute('size').value).to.be.null;
      expect(p.getAttribute('color').value).to.be.null;
    });
  });

  describe('Get attribute by name', () => {
    it('Should throw error if no attribute was found', () => {
      const p = new Product();
      expect(() => p.getAttribute('blaj')).to.throw('Attribute not found');
    });

    it('Should return the found attribute', () => {
      const p = new Product();
      expect(p.getAttribute('size')).to.be.instanceOf(Attribute);
    });
  });

  describe('Get configurable attributes', () => {
    it('Should not get non-configurable attributes', () => {
      const p = new Product();
      p.attributes.push(new Attribute('testname', null, false));

      for (const attr of p.getConfigurableAttributes()) {
        expect(attr.configurable).to.be.true;
      }
    });
  });


});
