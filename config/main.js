module.exports = {
  jwtSecret: 'fBFhclMkSZL1MmjmJccxX1UcGzhtEL',
  jwtTTL: '7d',

  email: {
    sendername: 'Ekorp',
    senderemail: 'noreply@ekorp.com',
    sendgrid: {
      key: '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'
    }
  },

  customer: {
    // Whether or not to use email confirmation for customer accounts
    accountConfirmation: false,
  }
};
