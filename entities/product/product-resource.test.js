const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();

const Product = require('./product-resource');
const Attribute = require('./attribute');

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

    it('Should set and get materials', () => {
      const p = new Product();
      const l = 'materials';
      p.materials = l;
      expect(p.materials).to.equal(l);
    });

    it('Should set and get description', () => {
      const p = new Product();
      const l = 'description';
      p.description = l;
      expect(p.description).to.equal(l);
    });

    it('Should set and get shortdescription', () => {
      const p = new Product();
      const l = 'shortdescription';
      p.shortdescription = l;
      expect(p.shortdescription).to.equal(l);
    });

    it('Should set and get size', () => {
      const p = new Product();
      const l = 'size';
      p.size = l;
      expect(p.size).to.equal(l);
    });

    it('Should set and get colors', () => {
      const p = new Product();
      const l = ['color1', 'color2'];
      p.colors = l;
      expect(p.colors).to.deep.equal(l);
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
