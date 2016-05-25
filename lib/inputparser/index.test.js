const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

let InputParser = require('./');

describe('Input parser', () => {

  describe('Date range', () => {
    it('Should fall back on zero date if no fromdate is present', () => {
      const range = InputParser.dateRange(null, null);
      expect(range[0]).to.deep.equal(new Date('0000-01-01'));
    });

    it('Should fall back on future date if no todate is present', () => {
      const range = InputParser.dateRange(null, null);
      expect(range[1]).to.deep.equal(new Date('3000-01-01'));
    });

    it('Should return an array with from- and to date', () => {
      const fromDate = new Date('1990-02-20');
      const toDate = new Date('2002-02-02');
      const range = InputParser.dateRange(fromDate, toDate);
      expect(range).to.be.an.array;
      expect(range[0]).to.deep.equal(fromDate);
      expect(range[1]).to.deep.equal(toDate);
    });

    it('Should throw error if fromdate is after todate', () => {
      const fromDate = new Date('1990-02-20');
      const toDate = new Date('2002-02-02');

      expect(() => InputParser.dateRange(toDate, fromDate))
        .to.throw('From-date is after to-date');
    });
  });

  describe('Query list', () => {
    it('Should split the options by comma', () => {
      const list = InputParser.queryList('3,4,2');
      expect(list).to.deep.equal(['3', '4', '2']);
    });

    it('Should trim options that have whitespace', () => {
      const list = InputParser.queryList('3, 4, 2');
      expect(list).to.deep.equal(['3', '4', '2']);
    });

    it('Should return a list of one option if one option was present', () => {
      const list = InputParser.queryList('1');
      expect(list).to.deep.equal(['1']);
    });

    it('Should return an empty array of options no options was found', () => {
      const list = InputParser.queryList();
      expect(list).to.be.an.array;
      expect(list.length).to.equal(0);
    });
  });

  describe('Order', () => {
    it('Should not care about undefined input', () => {
      const sort = InputParser.order();
      expect(sort).to.equal(sort);
    });

    it('Should fallback on desc sorting', () => {
      const sort = InputParser.order('invalid');
      expect(sort).to.equal('desc');
    });

    it('Should support ASC', () => {
      const sort = InputParser.order('asc');
      expect(sort).to.equal('asc');
    });

    it('Should support uppercase input', () => {
      const sort = InputParser.order('ASC');
      expect(sort).to.equal('asc');
    });
  });

});
