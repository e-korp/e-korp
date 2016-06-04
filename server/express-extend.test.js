const chai = require('chai');
const expect = chai.expect;

const express = require('express');
require('./express-extend');

describe('Express extend', () => {
  describe('Oops', () => {
    it('should have an oops method on the response object', () => {
      expect(express.response.oops).to.be.a.function;
    });

    it('should format an error response to the client');
    it('should throw an error if the parameter isnt an Oops object');
  });

  describe('Reply', () => {
    it('should have an reply method on the response object', () => {
      expect(express.response.reply).to.be.a.function;
    });

    it('should set content-type header to the request');
    it('should serve the data to the client');
  });
});
