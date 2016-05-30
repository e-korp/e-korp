const chai = require('chai');
const expect = chai.expect;

const Roles = require('./user-roles');

describe('User roles', () => {

  it('Should have an ROLES property accessible', () => {
    expect(Roles.ROLES).to.not.be.undefined;
  });

});
