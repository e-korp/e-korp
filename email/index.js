/**
 * Handle email sending
 */

const config = require('../config/main');
const sendgrid = require('sendgrid')(config.email.sendgrid.key);

/**
 * Sends an activation email to the provided customer
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @param  {Customer} customer Customer model
 * @return {Promise}           Reject-promise on fail, API response on success
 */
const sendCustomerActivationEmail = (customer) => {
  return new Promise((resolve, reject) => {
    const email = new sendgrid.Email({
      to: customer.email,
      from: config.email.senderemail,
      fromname: config.email.sendername,
      subject: 'Please activate your account',
      text: `Please activate your account with: ${customer.activationcode}`
    });

    sendgrid.send(email, function(err, json) {
      if (err) {
        return reject(err);
      }

      return resolve(json);
    });
  });
};

module.exports = {
  sendCustomerActivationEmail: sendCustomerActivationEmail,
};
