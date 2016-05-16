const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();

const ProductGroup = require('../../../src/resources/product-group');
const Product = require('../../../src/resources/product');

describe('Product group', () => {
  describe('Getters and setters', () => {
    it('Should set and get name', () => {
      const pg = new ProductGroup();
      pg.name = 'The name';
      expect(pg.name).to.equal('The name');
    });

    it('Should set and get id', () => {
      const pg = new ProductGroup();
      pg.id = 1212;
      expect(pg.id).to.equal(1212);
    });

    it('Should set and get products', () => {
      const list = ['Product1', 'Product2'];
      const pg = new ProductGroup();
      pg.products = list;
      expect(pg.products).to.deep.equal(list);
    });
  });

  describe('Add product', () => {
    it('Should add a product to the group', () => {
      const pg = new ProductGroup();
      pg.addProduct(new Product());
      expect(pg.products.length).to.equal(1);
    });
  });

  describe('Get options', () => {
    it('Should get the differences between products', () => {
      const pg = new ProductGroup();

      // Setup two different products and add them to the product group
      const p1 = new Product();
      const p2 = new Product();

      p1.size = 32;
      p2.size = 34;

      p1.color = 'Brown';
      p2.color = 'Blue';

      pg.addProduct(p1);
      pg.addProduct(p2);

      const actual = pg.getAllOptions();
      expect(actual).to.deep.equal({size: [32, 34], color: ['Brown', 'Blue']});
    });

    it('Should not add an option value two times (duplicates)', () => {
      const pg = new ProductGroup();

      // Setup two different products and add them to the product group
      const p1 = new Product();
      const p2 = new Product();

      p1.size = 32;
      p2.size = 34;

      p1.color = 'Blue';
      p2.color = 'Blue';

      pg.addProduct(p1);
      pg.addProduct(p2);

      const actual = pg.getAllOptions();
      expect(actual).to.deep.equal({size: [32, 34], color: ['Blue']});
    });
  });
});
