const chai = require('chai');
const expect = chai.expect;

const Log = require('./log-resource');

describe('Log', () => {
  describe('Getters and setters', () => {
    it('Should get and set description', () => {
      const m = 'my description';
      const l = new Log();
      l.description = m;
      expect(l.description).to.deep.equal(m);
    });

    it('Should get and set data', () => {
      const m = 'my data';
      const l = new Log();
      l.data = m;
      expect(l.data).to.deep.equal(m);
    });

    it('Should get and set level', () => {
      const m = 2;
      const l = new Log();
      l.level = m;
      expect(l.level).to.deep.equal(m);
    });

    it('Should get and set createdAt', () => {
      const m = 2;
      const l = new Log();
      l.createdAt = m;
      expect(l.createdAt).to.deep.equal(m);
    });

    it('Should get and set updatedAt', () => {
      const m = 2;
      const l = new Log();
      l.updatedAt = m;
      expect(l.updatedAt).to.deep.equal(m);
    });

    it('Should get and set id', () => {
      const m = 2;
      const l = new Log();
      l.id = m;
      expect(l.id).to.deep.equal(m);
    });

    it('Should get and set title', () => {
      const m = 2;
      const l = new Log();
      l.title = m;
      expect(l.title).to.deep.equal(m);
    });

    it('Should get and set stackTrace', () => {
      const m = 2;
      const l = new Log();
      l.stackTrace = m;
      expect(l.stackTrace).to.deep.equal(m);
    });

  });


});
