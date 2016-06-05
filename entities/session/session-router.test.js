const chai = require('chai');
const expect = chai.expect;

const SessionRouter = require('./session-router');

describe('Session router', () => {
  describe('Create', () => {
    it('should reject inactive accounts');
    it('should reject if the user wasnt found');
    it('should reject if the passwords didnt match');
  });
});
