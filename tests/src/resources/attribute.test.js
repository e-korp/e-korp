import chai from 'chai';
const expect = chai.expect;

const Attribute = require('../../../src/resources/attribute');

describe('Attribute', () => {
  describe('Getters and setters', () => {
    it('Should set and get name', () => {
      const a = new Attribute();
      a.name = 'The name';
      expect(a.name).to.equal('The name');
    });

    it('Should set and get value', () => {
      const a = new Attribute();
      a.value = 'The value';
      expect(a.value).to.equal('The value');
    });

    it('Should set and get configurable', () => {
      const a = new Attribute();
      a.configurable = true;
      expect(a.configurable).to.equal(true);
    });
  });

  describe('Constructor', () => {
    it('Should take name, value and configurable', () => {
      const a = new Attribute('name', 'some data', true);
      expect(a.name).to.equal('name');
      expect(a.value).to.equal('some data');
      expect(a.configurable).to.equal(true);
    });

    it('Should set configurable to false by default', () => {
      const a = new Attribute('some name', 'some value');
      expect(a.configurable).to.equal(false);
    });
  });


});
